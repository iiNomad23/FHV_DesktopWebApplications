# FHV_DesktopWebApplications
Implementing a ✝-platform time tracking desktop web application using [Ultralight](https://ultralig.ht) and [DaisyUI](https://daisyui.com).

# Start

The application can either be started from within your IDE which requires you to 
setup everything as described in [Ultralight Quickstart](QS_README.md).
However, if you don't want to build the application yourself you can also just run the .exe provided in the 
application.zip. Additionally, we also included a Version built on linux.

# Tests

The tests are in /src/tests.cc, googleTest was used as testing library.
Ultralight as of now does not seem to support any way of End-To-End testing as there is no mention of any testing in
their documentation:
![img.png](ultralight_doc_testing.png)

# Other known issues

Some other features like Date Selection, Alerts and Dialogs are not supported by Ultralight yet\
See: https://github.com/ultralight-ux/Ultralight/issues/178

