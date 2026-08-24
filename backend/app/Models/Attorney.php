<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Attorney extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'designation',
        'email',
        'phone',
        'photo_url',
        'bio',
        'bar_admissions',
        'education',
        'social_links',
        'is_active',
    ];

    protected $casts = [
        'bar_admissions' => 'array',
        'education' => 'array',
        'social_links' => 'array',
        'is_active' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function practiceAreas(): BelongsToMany
    {
        return $this->belongsToMany(PracticeArea::class, 'attorney_practice_area')
                    ->withTimestamps();
    }

    public function caseResults(): HasMany
    {
        return $this->hasMany(CaseResult::class, 'lead_attorney_id');
    }
}
