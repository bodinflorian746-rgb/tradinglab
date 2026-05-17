import FlipDiagram from "@/app/components/charts/FlipDiagram";
import TrendlineMADiagram from "@/app/components/charts/TrendlineMADiagram";
import InvalidationDiagram from "@/app/components/charts/InvalidationDiagram";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import CandleStrengthComparisonDiagram from "@/app/components/charts/CandleStrengthComparisonDiagram";
import DivergenceTypesComparisonDiagram from "@/app/components/charts/DivergenceTypesComparisonDiagram";
import DTBMeasuredMoveProjectionDiagram from "@/app/components/charts/DTBMeasuredMoveProjectionDiagram";
import DTBValidationGridDiagram from "@/app/components/charts/DTBValidationGridDiagram";
import EngulfingValidationGridDiagram from "@/app/components/charts/EngulfingValidationGridDiagram";
import FakeVsRealBreakoutComparisonDiagram from "@/app/components/charts/FakeVsRealBreakoutComparisonDiagram";
import FibTPProjectionDiagram from "@/app/components/charts/FibTPProjectionDiagram";
import FlipRetestValidationDiagram from "@/app/components/charts/FlipRetestValidationDiagram";
import HSTradeExecutionDiagram from "@/app/components/charts/HSTradeExecutionDiagram";
import InternalVsExternalStructureZoomDiagram from "@/app/components/charts/InternalVsExternalStructureZoomDiagram";
import InvalidationTriggersGridDiagram from "@/app/components/charts/InvalidationTriggersGridDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";
import MMHierarchyStackDiagram from "@/app/components/charts/MMHierarchyStackDiagram";
import OBExecutionPlanDiagram from "@/app/components/charts/OBExecutionPlanDiagram";
import OBFreshnessDiagram from "@/app/components/charts/OBFreshnessDiagram";
import StrongVsWeakLevelDiagram from "@/app/components/charts/StrongVsWeakLevelDiagram";
import BullishVsBearishEngulfingDiagram from "@/app/components/charts/BullishVsBearishEngulfingDiagram";
import CandleContextReadingDiagram from "@/app/components/charts/CandleContextReadingDiagram";
import DivergenceWithoutBreakoutDiagram from "@/app/components/charts/DivergenceWithoutBreakoutDiagram";
import EngulfingContextDiagram from "@/app/components/charts/EngulfingContextDiagram";
import FibPullbackChecklistDiagram from "@/app/components/charts/FibPullbackChecklistDiagram";
import FlipFailureDiagram from "@/app/components/charts/FlipFailureDiagram";
import HSNecklineSlopeDiagram from "@/app/components/charts/HSNecklineSlopeDiagram";
import MultiTFAlignmentCheckDiagram from "@/app/components/charts/MultiTFAlignmentCheckDiagram";
import MultiTFConflictDiagram from "@/app/components/charts/MultiTFConflictDiagram";
import OBSLPlacementDiagram from "@/app/components/charts/OBSLPlacementDiagram";
import PinBarFailureDiagram from "@/app/components/charts/PinBarFailureDiagram";
import PinBarLocationDiagram from "@/app/components/charts/PinBarLocationDiagram";
import PinBarValidationGridDiagram from "@/app/components/charts/PinBarValidationGridDiagram";
import SLManagementProgressionDiagram from "@/app/components/charts/SLManagementProgressionDiagram";
import SMCPhasesDiagram from "@/app/components/charts/SMCPhasesDiagram";
import SRHierarchyDiagram from "@/app/components/charts/SRHierarchyDiagram";
import SRQualificationChecklistDiagram from "@/app/components/charts/SRQualificationChecklistDiagram";
import StopHuntDiagram from "@/app/components/charts/StopHuntDiagram";
import TrendIdentificationStepsDiagram from "@/app/components/charts/TrendIdentificationStepsDiagram";
import TrendlineWrongDrawingDiagram from "@/app/components/charts/TrendlineWrongDrawingDiagram";
import TrendStrengthGradationDiagram from "@/app/components/charts/TrendStrengthGradationDiagram";
import ZoneVsLineDiagram from "@/app/components/charts/ZoneVsLineDiagram";

function PreviewBlock({
  name,
  priority,
  module,
  children,
}: {
  name: string;
  priority: "HAUTE" | "MOYENNE";
  module: string;
  children: React.ReactNode;
}) {
  const priorityBg =
    priority === "HAUTE"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
      : "bg-blue-500/20 text-blue-400 border-blue-500/40";

  return (
    <section className="my-8">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className={`px-2 py-1 text-xs rounded border ${priorityBg}`}>
          {priority}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
          {module}
        </span>
      </div>
      <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
        {children}
      </div>
    </section>
  );
}

export default function PreviewSvgPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">
          Preview composants SVG — Session refonte Stratégies
        </h1>
        <p className="text-zinc-400 mb-12">
          44 nouveaux composants créés lors de la session de refonte Stratégies. Vérification visuelle avant intégration dans les pages.
        </p>

        {/* ═══════════ Session précédente (3 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-12 border-b border-zinc-800 pb-2">
          Session précédente (3 composants)
        </h2>

        <PreviewBlock name="FlipDiagram" priority="HAUTE" module="SR L3">
          <FlipDiagram />
        </PreviewBlock>

        <PreviewBlock name="TrendlineMADiagram" priority="MOYENNE" module="TF L2">
          <TrendlineMADiagram />
        </PreviewBlock>

        <PreviewBlock name="InvalidationDiagram" priority="MOYENNE" module="REV L4">
          <InvalidationDiagram />
        </PreviewBlock>

        {/* ═══════════ Module Price Action (10 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-16 border-b border-zinc-800 pb-2">
          Module Price Action (10 composants)
        </h2>

        <PreviewBlock name="CandleStrengthComparisonDiagram" priority="HAUTE" module="PA L1">
          <CandleStrengthComparisonDiagram />
        </PreviewBlock>

        <PreviewBlock name="CandleContextReadingDiagram" priority="MOYENNE" module="PA L1">
          <CandleContextReadingDiagram />
        </PreviewBlock>

        <PreviewBlock name="PinBarValidationGridDiagram" priority="HAUTE" module="PA L2">
          <PinBarValidationGridDiagram />
        </PreviewBlock>

        <PreviewBlock name="PinBarLocationDiagram" priority="HAUTE" module="PA L2">
          <PinBarLocationDiagram />
        </PreviewBlock>

        <PreviewBlock name="PinBarFailureDiagram" priority="MOYENNE" module="PA L2">
          <PinBarFailureDiagram />
        </PreviewBlock>

        <PreviewBlock name="EngulfingValidationGridDiagram" priority="HAUTE" module="PA L3">
          <EngulfingValidationGridDiagram />
        </PreviewBlock>

        <PreviewBlock name="BullishVsBearishEngulfingDiagram" priority="MOYENNE" module="PA L3">
          <BullishVsBearishEngulfingDiagram />
        </PreviewBlock>

        <PreviewBlock name="EngulfingContextDiagram" priority="MOYENNE" module="PA L3">
          <EngulfingContextDiagram />
        </PreviewBlock>

        <PreviewBlock name="MultiTFAlignmentCheckDiagram" priority="MOYENNE" module="PA L4">
          <MultiTFAlignmentCheckDiagram />
        </PreviewBlock>

        <PreviewBlock name="MultiTFConflictDiagram" priority="MOYENNE" module="PA L4">
          <MultiTFConflictDiagram />
        </PreviewBlock>

        {/* ═══════════ Module Support / Résistance (8 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-16 border-b border-zinc-800 pb-2">
          Module Support / Résistance (8 composants)
        </h2>

        <PreviewBlock name="StrongVsWeakLevelDiagram" priority="HAUTE" module="SR L1">
          <StrongVsWeakLevelDiagram />
        </PreviewBlock>

        <PreviewBlock name="ZoneVsLineDiagram" priority="MOYENNE" module="SR L1">
          <ZoneVsLineDiagram />
        </PreviewBlock>

        <PreviewBlock name="SRHierarchyDiagram" priority="MOYENNE" module="SR L2">
          <SRHierarchyDiagram />
        </PreviewBlock>

        <PreviewBlock name="SRQualificationChecklistDiagram" priority="MOYENNE" module="SR L2">
          <SRQualificationChecklistDiagram />
        </PreviewBlock>

        <PreviewBlock name="FlipRetestValidationDiagram" priority="HAUTE" module="SR L3">
          <FlipRetestValidationDiagram />
        </PreviewBlock>

        <PreviewBlock name="FlipFailureDiagram" priority="MOYENNE" module="SR L3">
          <FlipFailureDiagram />
        </PreviewBlock>

        <PreviewBlock name="FakeVsRealBreakoutComparisonDiagram" priority="HAUTE" module="SR L4">
          <FakeVsRealBreakoutComparisonDiagram />
        </PreviewBlock>

        <PreviewBlock name="StopHuntDiagram" priority="MOYENNE" module="SR L4">
          <StopHuntDiagram />
        </PreviewBlock>

        {/* ═══════════ Module Trend Following (8 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-16 border-b border-zinc-800 pb-2">
          Module Trend Following (8 composants)
        </h2>

        <PreviewBlock name="TrendIdentificationStepsDiagram" priority="MOYENNE" module="TF L1">
          <TrendIdentificationStepsDiagram />
        </PreviewBlock>

        <PreviewBlock name="TrendStrengthGradationDiagram" priority="MOYENNE" module="TF L1">
          <TrendStrengthGradationDiagram />
        </PreviewBlock>

        <PreviewBlock name="MMHierarchyStackDiagram" priority="HAUTE" module="TF L2">
          <MMHierarchyStackDiagram />
        </PreviewBlock>

        <PreviewBlock name="TrendlineWrongDrawingDiagram" priority="MOYENNE" module="TF L2">
          <TrendlineWrongDrawingDiagram />
        </PreviewBlock>

        <PreviewBlock name="FibTPProjectionDiagram" priority="HAUTE" module="TF L3">
          <FibTPProjectionDiagram />
        </PreviewBlock>

        <PreviewBlock name="FibPullbackChecklistDiagram" priority="MOYENNE" module="TF L3">
          <FibPullbackChecklistDiagram />
        </PreviewBlock>

        <PreviewBlock name="BOSvsCHoCHComparisonDiagram" priority="HAUTE" module="TF L4 + SMC L2">
          <BOSvsCHoCHComparisonDiagram />
        </PreviewBlock>

        <PreviewBlock name="BOSFakeoutDiagram" priority="HAUTE" module="TF L4">
          <BOSFakeoutDiagram />
        </PreviewBlock>

        {/* ═══════════ Module Reversal (8 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-16 border-b border-zinc-800 pb-2">
          Module Reversal (8 composants)
        </h2>

        <PreviewBlock name="DTBValidationGridDiagram" priority="HAUTE" module="REV L1">
          <DTBValidationGridDiagram />
        </PreviewBlock>

        <PreviewBlock name="DTBMeasuredMoveProjectionDiagram" priority="HAUTE" module="REV L1">
          <DTBMeasuredMoveProjectionDiagram />
        </PreviewBlock>

        <PreviewBlock name="HSTradeExecutionDiagram" priority="HAUTE" module="REV L2">
          <HSTradeExecutionDiagram />
        </PreviewBlock>

        <PreviewBlock name="HSNecklineSlopeDiagram" priority="MOYENNE" module="REV L2">
          <HSNecklineSlopeDiagram />
        </PreviewBlock>

        <PreviewBlock name="DivergenceTypesComparisonDiagram" priority="HAUTE" module="REV L3">
          <DivergenceTypesComparisonDiagram />
        </PreviewBlock>

        <PreviewBlock name="DivergenceWithoutBreakoutDiagram" priority="MOYENNE" module="REV L3">
          <DivergenceWithoutBreakoutDiagram />
        </PreviewBlock>

        <PreviewBlock name="InvalidationTriggersGridDiagram" priority="HAUTE" module="REV L4">
          <InvalidationTriggersGridDiagram />
        </PreviewBlock>

        <PreviewBlock name="SLManagementProgressionDiagram" priority="MOYENNE" module="REV L4">
          <SLManagementProgressionDiagram />
        </PreviewBlock>

        {/* ═══════════ Module SMC (7 composants) ═══════════ */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 mt-16 border-b border-zinc-800 pb-2">
          Module SMC (7 composants)
        </h2>

        <PreviewBlock name="InternalVsExternalStructureZoomDiagram" priority="HAUTE" module="SMC L1">
          <InternalVsExternalStructureZoomDiagram />
        </PreviewBlock>

        <PreviewBlock name="SMCPhasesDiagram" priority="MOYENNE" module="SMC L1">
          <SMCPhasesDiagram />
        </PreviewBlock>

        <PreviewBlock name="BOSCHoCHSequenceDiagram" priority="HAUTE" module="SMC L2">
          <BOSCHoCHSequenceDiagram />
        </PreviewBlock>

        <PreviewBlock name="MitigationZoneEntryDiagram" priority="HAUTE" module="SMC L2">
          <MitigationZoneEntryDiagram />
        </PreviewBlock>

        <PreviewBlock name="OBExecutionPlanDiagram" priority="HAUTE" module="SMC L3">
          <OBExecutionPlanDiagram />
        </PreviewBlock>

        <PreviewBlock name="OBFreshnessDiagram" priority="HAUTE" module="SMC L3">
          <OBFreshnessDiagram />
        </PreviewBlock>

        <PreviewBlock name="OBSLPlacementDiagram" priority="MOYENNE" module="SMC L3">
          <OBSLPlacementDiagram />
        </PreviewBlock>

      </div>
    </main>
  );
}
