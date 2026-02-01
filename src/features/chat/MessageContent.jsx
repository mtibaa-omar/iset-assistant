import MessageImage from "./MessageImage";
import MessagePDF from "./MessagePDF";
import MessageText from "./MessageText";

export default function MessageContent({ message, isOwn }) {
  const isFileMessage = message.kind === "file" && message.cloudinary_url;
  const isImage = isFileMessage && message.cloudinary_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = isFileMessage && !isImage;

  if (isImage) {
    return (
      <MessageImage
        cloudinaryUrl={message.cloudinary_url}
        fileName={message.file_name}
        caption={message.body}
        isOwn={isOwn}
      />
    );
  }

  if (isPDF) {
    return (
      <MessagePDF
        cloudinaryUrl={message.cloudinary_url}
        fileName={message.file_name}
        caption={message.body}
        isOwn={isOwn}
      />
    );
  }

  return <MessageText body={message.body} />;
}
