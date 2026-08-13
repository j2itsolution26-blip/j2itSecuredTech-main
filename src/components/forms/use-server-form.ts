'use client';

import * as React from 'react';
import { useForm, type DefaultValues, type FieldValues, type Path, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { IDLE_STATE, type ActionState } from '@/lib/action-result';

type ServerAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Bridges React Hook Form to a Server Action.
 *
 * Zod validates in the browser for instant feedback, then the same schema runs
 * again on the server — the client result is never trusted. Field errors the
 * server returns are mapped back onto the corresponding inputs.
 */
export function useServerForm<TSchema extends z.ZodType<FieldValues>>({
  schema,
  action,
  defaultValues,
  resetOnSuccess = true,
}: {
  schema: TSchema;
  action: ServerAction;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  resetOnSuccess?: boolean;
}) {
  type Values = z.infer<TSchema>;

  const [state, setState] = React.useState<ActionState>(IDLE_STATE);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Values>({
    resolver: zodResolver(schema) as unknown as Resolver<Values>,
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'boolean') {
          if (value) formData.set(key, 'true');
        } else if (value !== undefined && value !== null) {
          formData.set(key, String(value));
        }
      }

      const result = await action(IDLE_STATE, formData);
      setState(result);

      if (result.status === 'error' && result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            form.setError(field as Path<Values>, { type: 'server', message: messages[0] });
          }
        }
      }

      if (result.status === 'success' && resetOnSuccess) {
        form.reset(defaultValues);
      }
    });
  });

  return { form, state, isPending, onSubmit, resetState: () => setState(IDLE_STATE) };
}
