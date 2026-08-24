<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticeAreaResource extends JsonResource
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
            'icon' => $this->icon,
            'short_summary' => $this->short_summary,
            'description' => $this->description,
            'is_featured' => (bool) $this->is_featured,
            'parent_id' => $this->parent_id,
            'parent' => new PracticeAreaResource($this->whenLoaded('parent')),
            'children' => PracticeAreaResource::collection($this->whenLoaded('children')),
            'attorneys' => AttorneyResource::collection($this->whenLoaded('attorneys')),
            'case_results' => CaseResultResource::collection($this->whenLoaded('caseResults')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
