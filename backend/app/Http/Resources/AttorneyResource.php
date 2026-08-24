<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttorneyResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'designation' => $this->designation,
            'email' => $this->email,
            'phone' => $this->phone,
            'photo_url' => $this->photo_url,
            'bio' => $this->bio,
            'bar_admissions' => $this->bar_admissions ?? [],
            'education' => $this->education ?? [],
            'social_links' => $this->social_links ?? [],
            'is_active' => (bool) $this->is_active,
            'practice_areas' => PracticeAreaResource::collection($this->whenLoaded('practiceAreas')),
            'case_results' => CaseResultResource::collection($this->whenLoaded('caseResults')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
