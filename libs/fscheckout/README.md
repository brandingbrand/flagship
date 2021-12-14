# FSCheckout

## Problems to solve

* Generally, checkout flows have similar features like state management and step trackers so we
  shouldn't reinvent the wheel.
* Checkout is complicated so we don't want 10 projects with 10 different code structures to manage.
* Despite some similarities, many checkouts have unique features so we don't want an inflexible
  library that makes it hard to customize.

## Goal

* Create a way to standardize the checkout structure.
* Make common functionalities reusable.
* Make it flexible for customization.

## How

* Project checkout has to built with `FSCheckout` component.
* Leverage TypeScript to force a standardized code structure for:
  * how steps are structured
  * how checkout state and data are managed
  * how api request is made
  * how step progress is managed
* Each step must be separated into its own component and passed to FSCheckout as props with their
  name and status.
* Step Component must be StatelessComponent, and all the states have to go into the main Checkout
  component as a single state.
* `checkoutState` and `checkoutActions` are required to pass to FSCheckout for defining checkout
  state and actions
* Step progress is managed internally in `FSCheckout`, and reference function is provided to perform
  arbitrary step jump.
* step changing hook is provided to do stuff like analtyics
* A global loading view is provided to mask user interaction. It can be overridden with a custom render.
* Built in a step tracker. It's customizable with style props and can be overridden with a custom render.
