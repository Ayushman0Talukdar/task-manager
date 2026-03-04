export default function NativeTooltip({ text, children }) {
    return (
      <div className="tooltip-container">
        {children}
        <span className="tooltip-text">{text}</span>
      </div>
    );
  }