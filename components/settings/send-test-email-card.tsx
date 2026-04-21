"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { initialSendTestEmailState, sendTestEmailAction } from "@/app/settings/actions";

export function SendTestEmailCard() {
  const [state, action, isPending] = useActionState(sendTestEmailAction, initialSendTestEmailState);

  return (
    <Card surface="paper" className="bg-card/70">
      <CardHeader>
        <CardTitle className="text-xl">SMTP transport check</CardTitle>
        <CardDescription>
          Runs a transport verify call, then sends a test message using Atriae&apos;s SMTP mailer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-3">
          <label className="space-y-1.5 text-sm">
            <span className="text-muted-foreground">Recipient email</span>
            <Input type="email" name="to" required placeholder="you@example.com" />
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sending..." : "Send test email"}
          </Button>
          {state.status !== "idle" ? (
            <p className={state.status === "error" ? "text-sm text-red-500" : "text-sm text-emerald-600"}>
              {state.message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
