import { ArrowUpRight, Heart, MapPin, Share2, SlidersHorizontal, Wallet, X } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CompareCheck } from "@/components/ui/compare-check";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SaveButton } from "@/components/ui/save-button";
import { SearchIsland } from "@/components/ui/search-island";
import { LabGroup, LabSection, SpecimenCaption } from "./lab-section";

const VARIANTS: readonly ButtonVariant[] = ["primary", "glass", "secondary", "ghost", "danger"];
const BADGE_TONES: readonly BadgeTone[] = ["neutral", "accent", "positive", "warning", "danger", "glass", "ink"];

export function ControlsLab() {
  return (
    <LabSection
      id="controls"
      index="03"
      title="Controls"
      description="Physical, legible controls. Hover lifts at most a pixel, press compresses to 98%, and every state is distinguishable without colour alone."
    >
      <LabGroup title="Buttons" note="primary · glass · secondary · ghost · danger">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} className="capitalize">
                {variant}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="lg" icon={ArrowUpRight}>
              Explore colleges
            </Button>
            <Button size="md" variant="glass" icon={ArrowUpRight}>
              With capsule
            </Button>
            <Button size="md" variant="secondary" icon={ArrowUpRight}>
              Secondary
            </Button>
          </div>
        </div>
      </LabGroup>

      <LabGroup title="Icon buttons" note="An accessible label is required">
        <div className="flex flex-wrap items-center gap-3">
          <IconButton icon={Heart} label="Save" />
          <IconButton icon={Share2} label="Share" variant="ghost" />
          <IconButton icon={SlidersHorizontal} label="Filters" variant="solid" />
          <IconButton icon={X} label="Close" size="sm" />
          <IconButton icon={X} label="Close" size="sm" variant="ghost" />
        </div>
      </LabGroup>

      <LabGroup title="Inputs" note="Labels are always present; hidden only when context makes them redundant">
        <div className="grid gap-6 md:grid-cols-2">
          <Input id="lab-name" label="College name" placeholder="e.g. Northfield Institute" />
          <Input id="lab-city" label="City" icon={MapPin} placeholder="Pune" hint="Cities in India." />
          <Input
            id="lab-fees"
            label="Maximum annual fees"
            icon={Wallet}
            defaultValue="two lakh"
            error="Enter an amount in rupees, for example 200000."
          />
          <Input id="lab-course" label="Course" placeholder="Choose a stream first" disabled />
          <Input id="lab-glass" label="Glass input" surface="glass" placeholder="For cinematic surfaces" />
        </div>
      </LabGroup>

      <LabGroup title="Search island" note="Signature surface · submits a plain GET form">
        <div className="max-w-3xl">
          <SearchIsland id="lab-search" />
        </div>
      </LabGroup>

      <LabGroup title="Chips and badges">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip selected>Engineering</Chip>
            <Chip>Medical</Chip>
            <Chip>Management</Chip>
            <Chip icon={SlidersHorizontal}>More filters</Chip>
            <Chip disabled>Law</Chip>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {BADGE_TONES.map((tone) => (
              <Badge key={tone} tone={tone} dot className="capitalize">
                {tone}
              </Badge>
            ))}
          </div>
        </div>
      </LabGroup>

      <LabGroup title="Toggles" note="Save and compare contracts · presentation only in Phase 0">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <SaveButton itemName="Northfield Institute" />
              <SaveButton itemName="Riverside College" defaultSaved />
            </div>
            <SpecimenCaption name="Save" detail="Outline → compress → filled" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <CompareCheck itemName="Northfield Institute" />
              <CompareCheck itemName="Riverside College" defaultChecked />
              <CompareCheck itemName="Lakeview University" disabled />
            </div>
            <SpecimenCaption name="Compare" detail="Empty → soft fill → check reveal" />
          </div>
        </div>
      </LabGroup>
    </LabSection>
  );
}
