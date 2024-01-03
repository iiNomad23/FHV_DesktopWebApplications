# FHV_DesktopWebApplications
Implementing a ✝-platform time tracking desktop web application using [Ultralight](https://ultralig.ht) and [DaisyUI](https://daisyui.com).

How to use:  
[Ultralight Quickstart](https://github.com/iiNomad23/FHV_DesktopWebApplications/blob/main/QS_README.md)


## Conan Setup [not used]

https://conan.io/downloads \
download & install the windows installer (make sure to include conan in your path variable)\
add following file (`conanfile.txt`) to the root of your project
```
[requires]
sqlite3/3.44.2

[generators]
CMakeToolchain
```
and initialize conan in your project by first running
```shell
conan profile detect
```
and then
```shell
conan install .
```
