import { MessageStatus, QuoteStatus } from '@prisma/client';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { humanizeEnum } from '@/lib/utils';

const QUOTE_TONES: Record<QuoteStatus, BadgeProps['variant']> = {
  [QuoteStatus.PENDING]: 'warning',
  [QuoteStatus.REVIEWING]: 'info',
  [QuoteStatus.QUOTED]: 'primary',
  [QuoteStatus.WON]: 'success',
  [QuoteStatus.LOST]: 'danger',
  [QuoteStatus.ARCHIVED]: 'outline',
};

const MESSAGE_TONES: Record<MessageStatus, BadgeProps['variant']> = {
  [MessageStatus.UNREAD]: 'warning',
  [MessageStatus.READ]: 'info',
  [MessageStatus.ARCHIVED]: 'outline',
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge variant={QUOTE_TONES[status]}>{humanizeEnum(status)}</Badge>;
}

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  return <Badge variant={MESSAGE_TONES[status]}>{humanizeEnum(status)}</Badge>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <Badge variant={published ? 'success' : 'outline'}>{published ? 'Published' : 'Draft'}</Badge>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? 'success' : 'outline'}>{active ? 'Active' : 'Hidden'}</Badge>;
}
