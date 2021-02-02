import React, { useState } from "react";

function App() {
  const [showClock, setShowClock] = useState(true);

  return (
    <div>
      {showClock ? <Clock /> : null}
      <button onClick={() => setShowClock(false)}>Toggle Clock</button>
    </div>
  );
}

export default App;
