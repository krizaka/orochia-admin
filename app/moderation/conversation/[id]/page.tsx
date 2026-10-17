import { notFound } from "next/navigation";

import { moderateConversation } from "@/app/actions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn, Empty, PageTitle, Panel, td } from "@/components/ui";
import { ApiError, orochia } from "@/lib/orochia";

interface Context {
  reportId: string;
  reason: string;
  conversation: { id: string; kind: "direct" | "group"; title: string | null; archivedAt: string | null; members: number };
  reportedMessageId: string;
  messages: { id: string; seq: number; senderId: string; sender: string; content: string; createdAt: string }[];
}

/** The reported message and the ten either side — nothing else of the conversation. */
export default async function ConversationReport(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  let context: Context;
  try {
    context = (await orochia<{ context: Context }>(`/api/admin/reports/${id}/context`)).context;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  const { conversation, messages } = context;
  const group = conversation.kind === "group";
  return (
    <div>
      <PageTitle
        title={group ? `Group “${conversation.title ?? ""}”` : "Direct conversation"}
        subtitle={`${group ? `${conversation.members} members · ` : ""}the reported message and ten either side${conversation.archivedAt ? " · closed" : ""}`}
      />
      {messages.length === 0 ? (
        <Empty>No message to show.</Empty>
      ) : (
        <Panel>
          <table className="w-full">
            <tbody className="divide-y divide-border-subtle">
              {messages.map((m) => (
                <tr key={m.id} className={m.id === context.reportedMessageId ? "bg-danger/10" : undefined}>
                  <td className={cn(td, "whitespace-nowrap font-mono")}>@{m.sender}</td>
                  <td className={cn(td, "max-w-xl whitespace-pre-line")}>{m.content}</td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1.5">
                      <ConfirmDialog
                        action={moderateConversation}
                        fields={{ conversationId: conversation.id, action: "remove_message", target: m.id }}
                        trigger={{ label: "Remove", tone: "danger" }}
                        title="Remove the message"
                        description={<>The message disappears for everyone. The report keeps its copy of the text.</>}
                        reason={{ label: "Reason (recorded)", placeholder: context.reason }}
                        confirmLabel="Remove"
                      />
                      {group && m.id === context.reportedMessageId && (
                        <ConfirmDialog
                          action={moderateConversation}
                          fields={{ conversationId: conversation.id, action: "remove_member", target: m.senderId }}
                          trigger={{ label: `Remove @${m.sender} from the group`, tone: "danger" }}
                          title="Remove the member"
                          description={<>@{m.sender} leaves the group and stops receiving it.</>}
                          reason={{ label: "Reason (recorded)", placeholder: context.reason }}
                          confirmLabel="Remove from the group"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
      {group && !conversation.archivedAt && (
        <div className="mt-4">
          <ConfirmDialog
            action={moderateConversation}
            fields={{ conversationId: conversation.id, action: "archive", target: "" }}
            trigger={{ label: "Close the group", tone: "danger" }}
            title="Close the group"
            description={<>Nobody can write in it any more; members can still read it.</>}
            reason={{ label: "Reason (recorded)", placeholder: context.reason }}
            confirmLabel="Close the group"
          />
        </div>
      )}
    </div>
  );
}
