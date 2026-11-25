<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

class SupportTicket extends Model
{
    use HasFactory;

    public const STATUS_RESOLVED = 'Resolved';

    public const STATUS_CLOSED = 'Closed';

    protected $fillable = [
        'employee_id',
        'technician_id',
        'category_id',
        'priority_level',
        'ticket_description',
        'resolution_notes',
        'ticket_status',
    ];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (SupportTicket $ticket): void {
            if ($ticket->ticket_status === self::STATUS_RESOLVED
                && ($ticket->isDirty('ticket_status') || $ticket->resolved_at === null)) {
                $ticket->resolved_at = now();
            }
        });

        static::updating(function (SupportTicket $ticket): void {
            if ($ticket->getOriginal('ticket_status') === self::STATUS_CLOSED) {
                throw ValidationException::withMessages([
                    'ticket_status' => 'Closed tickets cannot be edited.',
                ]);
            }
        });

        static::deleting(function (SupportTicket $ticket): void {
            if ($ticket->ticket_status === self::STATUS_CLOSED) {
                throw ValidationException::withMessages([
                    'ticket_status' => 'Closed tickets cannot be deleted.',
                ]);
            }
        });
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function setTicketDescriptionAttribute(?string $value): void
    {
        $this->attributes['ticket_description'] = $value === null ? null : strip_tags($value);
    }

    public function setResolutionNotesAttribute(?string $value): void
    {
        $this->attributes['resolution_notes'] = $value === null ? null : strip_tags($value);
    }
}
