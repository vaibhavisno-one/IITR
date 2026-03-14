import MilestoneCard from "./MilestoneCard";

export default function MilestoneTimeline({ milestones = [], showSubmitButton = true }) {
  if (milestones.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted">
        No milestones created yet.
      </p>
    );
  }

  return (
    <div>
      {milestones.map((milestone, index) => (
        <MilestoneCard
          key={milestone._id || milestone.id || index}
          milestone={milestone}
          index={index}
          showSubmitButton={showSubmitButton}
        />
      ))}
    </div>
  );
}
