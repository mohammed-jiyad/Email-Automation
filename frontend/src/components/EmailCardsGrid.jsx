import EmailCard from "./EmailCard";

export default function EmailCardsGrid({ emails }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 16,
    }}>
      {emails.map(email => (
        <EmailCard key={email._id} email={email} />
      ))}
    </div>
  );
}
