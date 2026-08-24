<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CaseResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'settlement_verdict',
        'practice_area_id',
        'lead_attorney_id',
        'summary',
        'case_year',
    ];

    protected $casts = [
        'case_year' => 'integer',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

    public function practiceArea(): BelongsTo
    {
        return $this->belongsTo(PracticeArea::class);
    }

    public function leadAttorney(): BelongsTo
    {
        return $this->belongsTo(Attorney::class, 'lead_attorney_id');
    }
}
