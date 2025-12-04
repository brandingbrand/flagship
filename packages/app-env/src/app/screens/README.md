# Optional DevMenu Screens Directory

This directory contains optional add-in screens for the DevMenu. These screens are not required for the core functionality of the app but can enhance the developer experience by providing additional tools or information.

## IMPORTANT

Screens should not be included in **any** barrel file export, or be referenced by any other file in the app. These screens are meant to interface with optional native modules that may not exist in all environments. Including these screens in the main export will cause crashes downstream.
