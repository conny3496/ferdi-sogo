import com.atlassian.event.Event
import com.atlassian.jira.component.ComponentAccessor
import com.atlassian.jira.event.project.VersionReleaseEvent
import com.atlassian.jira.event.type.EventTypeManager
import com.atlassian.jira.issue.IssueManager
import groovy.json.JsonBuilder
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import com.atlassian.jira.event.issue.IssueEvent
import groovyx.net.http.Method
import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovy.time.TimeDuration
import com.atlassian.jira.issue.search.SearchProvider
import com.atlassian.jira.jql.parser.JqlQueryParser
import com.atlassian.jira.web.bean.PagerFilter
import java.time.*
import groovyx.net.http.RESTClient
import com.atlassian.jira.event.type.EventDispatchOption
import org.apache.log4j.Level
import org.apache.log4j.Logger
import groovy.json.JsonSlurper;
import com.atlassian.jira.util.json.JSONObject
import com.atlassian.jira.issue.Issue;
import groovy.json.StreamingJsonBuilder;
import com.atlassian.jira.issue.MutableIssue
import groovy.json.JsonOutput
import groovyx.net.http.ContentType
import groovyx.net.http.HttpResponseDecorator
import groovyx.net.http.RESTClient
import static groovyx.net.http.Method.*

Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.sendNotification")
logger.setLevel(Level.DEBUG)

IssueManager issueManager = ComponentAccessor.getIssueManager()
Issue issue = issueManager.getIssueObject("HAP-37")
// Issue issue = event.issue
//logger.debug "event: " + event
//logger.debug "event.eventType: " + event.getEventTypeId()

def getAccessToken(String userName, String password) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.getAccessToken")
    logger.setLevel(Level.DEBUG)
    def bodyRAW = (["type": "m.login.password",
                    "user": "${userName}",
                    "password": "${password}",
                    "initial_device_display_name": "Honicon Jira2Element"])
    String body = JsonOutput.toJson(bodyRAW)
    logger.debug "body: " + body
    String accessToken = post("https://matrix.honicon.net", "/_matrix/client/r0/login",body).access_token
    return accessToken
}

def getTicketDetails(Issue issue,event) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.getTicketDetails")
    logger.setLevel(Level.DEBUG)
    String assingee,comment
    try {
        assingee = issue.getAssignee().getUsername()
    } catch (Exception noAssignee) {
        logger.debug "issue has no assignee, returning unassigned"
        assignee = "unassigned"
    }
    try {
        comment = event.getComment().getBody()
    } catch (Exception noAssignee) {
        logger.debug "issue has no comment, returning none"
        assignee = "none"
    }
    String status = issue.getStatus().getName()
    String project = issue.getProjectObject().getName()
    String projectLeader = issue.getProjectObject().getProjectLead().getUsername()
    String eventUser = event.getUser()
    return [assingee,comment,status,project,projectLeader,eventUser]
}

def sendNotification(String message, String room, Issue issue, IssueEvent event) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.sendNotification")
    logger.setLevel(Level.DEBUG)
    EventTypeManager eventTypeManager = ComponentAccessor.getEventTypeManager()
    String eventName = eventTypeManager.getEventType(event.getEventTypeId()).getName()
    final now = Instant.now().getEpochSecond()
    final random = Math.abs(new Random().nextInt() % 90000) +10000
    final String accessToken = getAccessToken("jiranotification","J{Cmx39Ne*u^AYi8")
    def (String assignee, String comment, String status, String projectName, String projectLeader, String eventUser) = getTicketDetails(issue,event)
    //final externalUrl = "https://matrix.honicon.net/_matrix/client/unstable/rooms/${room}/send/m.room.message/test?access_token=${accessToken}"
    final externalUrl = "https://matrix.honicon.net/_matrix/client/r0/rooms/${room}/send/m.room.message/${random}?access_token=${accessToken}"
    final endpointAndQuery = ""
    def bodyRAW = (["msgtype": "m.text",
                    "body": "${message}",
                    "formatted_body": "<table>\n" +
                        "  <caption>${eventName}</caption>\n" +
                        "  <tr>\n" +
                        "    <th>Key</th>\n" +
                        "    <th>Value</th>\n" +
                        "  </tr>\n" +
                        "  <tr>\n" +
                        "    <td>IssueKey</td>\n" +
                        "    <td><a href=\"https://jira.honicon.com/browse/${issue.getKey()}\">${issue.getKey()}</td>\n" +
                        "  </tr>\n" +
                        "  <tr>\n" +
                        "    <td>Assignee</td>\n" +
                        "    <td><a href=\"https://matrix.to/#/@${assignee}:honicon.net\">${assignee}</a></td>\n" +
                        "  </tr>\n" +
                        "  <tr>\n" +
                        "    <td>Status</td>\n" +
                        "    <td>${status}</td>\n" +
                        "  </tr>\n" +
                        "  <tr>\n" +
                        "    <td>Eventactor</td>\n" +
                        "    <td>${eventUser}</td>\n" +
                        "  </tr>\n" +
                        "  <tr>\n" +
                        "    <td>Comment</td>\n" +
                        "    <td>${comment}</td>\n" +
                        "  </tr>\n" +
                        "</table>",
                    "event_id": "${now}${random}",
                    "format": "org.matrix.custom.html"])
    String body = JsonOutput.toJson(bodyRAW)
    logger.debug "fullUrl: " + externalUrl + endpointAndQuery
    logger.debug "body: " + body
    def putResponse = put(externalUrl, endpointAndQuery, body)
    logger.debug "putResponse: " + putResponse
}

def post(def hostUrl, def endpointAndQuery, def bodyJson) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.post")
    logger.setLevel(Level.DEBUG)
    def client = new RESTClient(hostUrl)
    def responseBody
    client.setHeaders([
        'Accept'        : ContentType.JSON,
        'Content-Type'  : ContentType.JSON
    ])
    client.handler.success = { HttpResponseDecorator response, json ->
        json
        responseBody = json
    }
    client.handler.failure = { HttpResponseDecorator response ->
        // Failure can be handled here
        log.error response.entity.content.text
        [:]
    }
    client.post(
        path: endpointAndQuery,
        contentType: ContentType.JSON,
        body: bodyJson
    )
    logger.debug responseBody
    return responseBody
}

def put(def hostUrl, def endpointAndQuery, def bodyJson) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.put")
    logger.setLevel(Level.DEBUG)
    RESTClient client = new RESTClient(hostUrl)
    logger.debug "client: " + client
    client.setHeaders([
        'Accept'       : ContentType.JSON,
        'Content-Type' : ContentType.JSON
        // If authentication mechanism of the API is Basic Authentication, 'Authorization' header with username and password encoded as Base 64 can be specified here
        //'Authorization': "Basic ${'<YOUR USERNAME>:<YOUR PASSWORD>'.bytes.encodeBase64().toString()}"
    ])
    client.handler.success = { HttpResponseDecorator response, json ->
        json
    }
    client.handler.failure = { HttpResponseDecorator response ->
        // Failure can be handled here
        logger.error response.entity.content.text
        [:]
    }
    logger.debug "client.getUri: " + client
    client.getClient ().getParams ().setParameter ("http.connection.timeout", 2000)
    client.getClient ().getParams ().setParameter ("http.socket.timeout",     2000)
    client.put(
        path: endpointAndQuery,
        contentType: ContentType.JSON,
        body: bodyJson,
    )
}

def getRoomId(def hostUrl, def endpoint, String projectKey) {
    Logger logger = Logger.getLogger("com.honicon.atlassian.jira.jira2element.getRoomId")
    logger.setLevel(Level.DEBUG)
    def client = new RESTClient(hostUrl)
    def responseBody
    client.setHeaders([
        'Accept'        : ContentType.JSON,
        'Content-Type'  : ContentType.JSON
    ])
    client.handler.success = { HttpResponseDecorator response, json ->
        json
        responseBody = json.asObject(Map)
        // responseBody = responseBody
    }
    client.handler.failure = { HttpResponseDecorator response ->
        // Failure can be handled here
        logger.debug response.entity.content.text
        [:]
    }
    client.get(
        path: endpoint + "#" + projectKey + ":honicon.net",
        contentType: ContentType.JSON,
        // body: projectKey
    )
    logger.debug responseBody
    return responseBody
}

String projectKey = "TestKunde"
getRoomId("https://matrix.honicon.net", "/_matrix/client/r0/directory/room/",projectKey) //.access_token
if (!issue.getIssueType().subTask && 1==1) {
    logger.debug "Room ID for Room"
}
else if (!issue.getIssueType().subTask) {
//String rooms = getRooms("https://matrix.honicon.net/_matrix/client/r0/joined_rooms?access_token=\"MDAxOWxvY2F0aW9uIGhvbmljb24ubmV0CjAwMTNpZGVudGlmaWVyIGtleQowMDEwY2lkIGdlbiA9IDEKMDAzMGNpZCB1c2VyX2lkID0gQGppcmFub3RpZmljYXRpb246aG9uaWNvbi5uZXQKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBndn5waGQqOlBfXmFeemJ2CjAwMmZzaWduYXR1cmUgORqRZbtNaBuEerR8_cutAjcJg1IZEM1QAG4LyXrWk28K\"","")
    String message = issue.getKey() + " has been updated."
//    sendNotification(message, "!oPZLvtuqLUqwUebQYv:honicon.net", issue, event)
    logger.debug message
}
else {
    logger.debug "No notification send. Found no room and issue was subtask."
}