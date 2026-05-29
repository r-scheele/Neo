import { useSyncExternalStore, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

import { routes } from "@/constants/routes";
import {
  getIsSetupComplete,
  useSetupStore,
} from "@/stores/useSetupStore";

type GuardProps = {
  children: ReactNode;
};

function useSetupCompletionState() {
  const completedStepIds = useSetupStore((store) => store.completedStepIds);
  const isHydrated = useSyncExternalStore(
    subscribeToSetupHydration,
    getSetupHydrationSnapshot,
    getSetupHydrationSnapshot,
  );

  return {
    isHydrated,
    isSetupComplete: getIsSetupComplete(completedStepIds),
  };
}

function subscribeToSetupHydration(onStoreChange: () => void) {
  const unsubscribeHydrate = useSetupStore.persist.onHydrate(onStoreChange);
  const unsubscribeFinishHydration =
    useSetupStore.persist.onFinishHydration(onStoreChange);

  return () => {
    unsubscribeHydrate();
    unsubscribeFinishHydration();
  };
}

function getSetupHydrationSnapshot() {
  return useSetupStore.persist.hasHydrated();
}

function getSignedInLandingRoute(isSetupComplete: boolean) {
  return isSetupComplete ? routes.today : routes.setup;
}

export function RootRouteRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isHydrated, isSetupComplete } = useSetupCompletionState();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={routes.welcome} />;
  }

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={getSignedInLandingRoute(isSetupComplete)} />;
}

export function PublicAuthRouteGuard({ children }: GuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isHydrated, isSetupComplete } = useSetupCompletionState();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return children;
  }

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={getSignedInLandingRoute(isSetupComplete)} />;
}

export function SetupRouteGuard({ children }: GuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isHydrated, isSetupComplete } = useSetupCompletionState();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={routes.signIn} />;
  }

  if (!isHydrated) {
    return null;
  }

  if (isSetupComplete) {
    return <Redirect href={routes.today} />;
  }

  return children;
}

export function ProtectedRouteGuard({ children }: GuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isHydrated, isSetupComplete } = useSetupCompletionState();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={routes.signIn} />;
  }

  if (!isHydrated) {
    return null;
  }

  if (!isSetupComplete) {
    return <Redirect href={routes.setup} />;
  }

  return children;
}
