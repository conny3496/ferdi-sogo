# squonnygrub
A personal interpretation of other themes combined to my liking. I love mystelf a hint of green (Dark) or yellow (Bright Version - maybe some day).

The idea was to create a theme that can be customized by [Grub Customizer](https://launchpad.net/grub-customizer) by Danial Richter

Insprirations:
- [Breeze](https://www.gnome-look.org/p/1000140/) by Gustavo Castro
- [Primivistical](https://www.gnome-look.org/p/1280604/) by fffred
- [Sleek](https://www.gnome-look.org/p/1414997/) by Sandesh Sharma

Fonts by [Total Font Geek](https://www.fontspace.com/total-fontgeek-dtf-ltd)
Icons from [Iconify](https://iconify.design/icon-sets/mdi/)

See Grub documentation for reference
[Grub 2.04 Manual Chapter 7](https://www.gnu.org/software/grub/manual/grub/grub.html#Theme-file-format)

## Previews

Work in Progress - Someone please add previews from their VMs.
![Previews Sorted by Font-Type / Greeting / Custom Background]()

## Installation

### Manual Installation
Copy a useful `background.png` into the "_squonnygrub_" directory.

Copy the "_squonnygrub_" directory to a location GRUB can access it. The standard path is `/usr/share/grub/themes/`, but if your installing this theme in an encrypted system, you might prefer to copy this package content to `/boot` and set your GRUB configuration file accordingly.

Edit `/etc/default/grub`, making sure this line (or a variant of it) exists:
`GRUB_THEME="/usr/share/grub/themes/squonnygrub/theme.txt"`

And then run:
`sudo grub-mkconfig -o /boot/grub/grub.cfg`

### Shell Installer
Run the install.sh to get promted for customization.

work in Progress
