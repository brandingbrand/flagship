declare global {
  type RootStackParamList = {
    Main: undefined;
    Modal: undefined;
  };

  type ModalStackParamList = {
    ForceUpdateModal: undefined;
    SoftUpdateModal: undefined;
    MaintenanceModal: undefined;
  };

  type BottomTabParamList = {
    DiscoverStack: undefined;
    ShopStack: undefined;
    WishlistStack: undefined;
    CartStack: undefined;
    AccountStack: undefined;
  };
}

// This export is needed to make the file a module
export {};
