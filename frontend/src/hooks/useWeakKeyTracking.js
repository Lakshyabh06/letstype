import { useMemo } from "react"

import { analyzeAttemptHistory } from "../utils/typingAnalysis"

function useWeakKeyTracking(attemptHistory = []) {
  return useMemo(() => analyzeAttemptHistory(attemptHistory), [attemptHistory])
}

export default useWeakKeyTracking
