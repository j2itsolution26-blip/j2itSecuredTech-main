import { MessageStatus, QuoteStatus } from '@prisma/client';
import { AdminForm, FormSection, HiddenId, SelectField, TextareaField } from '@/components/admin/AdminForm';
import { updateMessageStatus, updateQuoteStatus } from '@/lib/actions/admin-actions';
import { humanizeEnum } from '@/lib/utils';

const QUOTE_OPTIONS = Object.values(QuoteStatus).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

const MESSAGE_OPTIONS = Object.values(MessageStatus).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

/** Pipeline controls shown alongside a quote request. */
export function QuoteStatusForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: QuoteStatus;
  notes: string | null;
}) {
  return (
    <AdminForm action={updateQuoteStatus} submitLabel="Update request">
      <HiddenId value={id} />

      <FormSection title="Pipeline" description="Status changes are recorded in the audit log.">
        <SelectField name="status" label="Status" options={QUOTE_OPTIONS} defaultValue={status} />
        <TextareaField
          name="notes"
          label="Internal notes"
          rows={6}
          defaultValue={notes}
          hint="Visible to console users only — never shown to the client."
        />
      </FormSection>
    </AdminForm>
  );
}

export function MessageStatusForm({
  id,
  status,
  notes,
}: {
  id: string;
  status: MessageStatus;
  notes: string | null;
}) {
  return (
    <AdminForm action={updateMessageStatus} submitLabel="Update message">
      <HiddenId value={id} />

      <FormSection title="Handling" description="Status changes are recorded in the audit log.">
        <SelectField name="status" label="Status" options={MESSAGE_OPTIONS} defaultValue={status} />
        <TextareaField name="notes" label="Internal notes" rows={6} defaultValue={notes} />
      </FormSection>
    </AdminForm>
  );
}
