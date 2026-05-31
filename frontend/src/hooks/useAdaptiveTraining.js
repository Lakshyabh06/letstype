import { useMemo } from "react"

import { generateAdaptivePractice } from "../utils/adaptivePracticeGenerator"

function useAdaptiveTraining(analytics) {
  return useMemo(
    () => ({
      practicePlan: generateAdaptivePractice(analytics),
    }),
    [analytics]
  )
}

export default useAdaptiveTraining
