import { Check } from "lucide-react";

export default function StepIndicator({ steps, current }) {
  return (
    <ol className="step-indicator">
      {steps.map((step, idx) => {
        const isCompleted = idx < current;
        const isCurrent = idx === current;
        const state = isCompleted ? "completed" : isCurrent ? "current" : "todo";
        const isLast = idx === steps.length - 1;

        return (
          <li
            key={step.label}
            className={`step-item${isLast ? " last" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <div className={`step-bubble ${state}`}>
              {isCompleted ? <Check size={16} /> : idx + 1}
            </div>

            <div className="step-caption">
              <p className={`step-label ${state}`}>{step.label}</p>
              <p className="step-description">{step.description}</p>
            </div>

            {!isLast && (
              <div className="step-connector">
                <div
                  className="step-connector-fill"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
