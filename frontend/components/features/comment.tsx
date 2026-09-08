interface CommentProps {
  author: string;
  content: string;
  createdAt: string;
}

export function Comment({ author, content, createdAt }: CommentProps) {
  return (
    <div className="flex gap-3 border-b border-border py-4 last:border-0">
      <div className="h-8 w-8 shrink-0 rounded-full bg-accent" />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{author}</span>
          <span className="text-muted">{createdAt}</span>
        </div>
        <p className="mt-1 text-sm text-foreground">{content}</p>
      </div>
    </div>
  );
}