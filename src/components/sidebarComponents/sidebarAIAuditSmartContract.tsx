const ComingSoon = ({ title }: { title: string }) => {
  return (
    <div className="glass-card p-12 text-center">
      <h1 className="text-3xl font-orbitron font-bold mb-4 neon-glow">{title}</h1>
      <p className="text-xl text-muted-foreground">Coming Soon</p>
    </div>
  );
};

const SidebarAIAuditSmartContract = () => {
  return <ComingSoon title="AI Audit - Smart Contract Analysis" />;
};

export default SidebarAIAuditSmartContract;