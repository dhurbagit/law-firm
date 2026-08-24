<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PracticeArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'icon',
        'short_summary',
        'description',
        'is_featured',
        'parent_id',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(PracticeArea::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(PracticeArea::class, 'parent_id');
    }

    public function attorneys(): BelongsToMany
    {
        return $this->belongsToMany(Attorney::class, 'attorney_practice_area')
                    ->withTimestamps();
    }

    public function caseResults(): HasMany
    {
        return $this->hasMany(CaseResult::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(ConsultationLead::class);
    }
}
