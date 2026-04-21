"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialSavePreferencesState, logoutAction, savePreferencesAction } from "@/app/settings/actions";

type Props = {
  displayName: string;
  morningRitualReminder: string;
};

export function ProfileSettingsForm({ displayName, morningRitualReminder }: Props) {
  const [state, formAction, isPending] = useActionState(savePreferencesAction, initialSavePreferencesState);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Display name</span>
          <Input name="display_name" defaultValue={displayName} required maxLength={80} />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Morning ritual reminder</span>
          <Input name="morning_ritual_reminder" defaultValue={morningRitualReminder} required maxLength={40} />
        </label>
        <Button disabled={isPending}>{isPending ? "Saving…" : "Save preferences"}</Button>
      </form>

      <form action={logoutAction}>
        <Button variant="quiet" type="submit">
          Logout
        </Button>
      </form>

      {state.status !== "idle" ? (
        <p className={`text-sm ${state.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>{state.message}</p>
      ) : null}
    </div>
  );
}
