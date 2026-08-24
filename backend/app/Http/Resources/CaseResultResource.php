<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'settlement_verdict' => $this->settlement_verdict,
            'practice_area_id' => $this->practice_area_id,
            'practice_area' => new PracticeAreaResource($this->whenLoaded('practiceArea')),
            'lead_attorney_id' => $this->lead_attorney_id,
            'lead_attorney' => new AttorneyResource($this->whenLoaded('leadAttorney')),
            'summary' => $this->summary,
            'case_year' => $this->case_year,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
