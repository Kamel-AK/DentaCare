<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use Illuminate\Console\Command;

class UpdateAppointmentStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update appointment statuses based on date/time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Appointment::where('status', 'مجدول')
            ->where(function ($query) {
                $query->whereDate('date', '<', now()->format('Y-m-d'))
                    ->orWhere(function ($q) {
                        $q->whereDate('date', now()->format('Y-m-d'))
                            ->whereTime('time', '<', now()->format('H:i:s'));
                    });
            })
            ->update(['status' => 'مكتمل']);

        $this->info('Appointment statuses updated successfully.');
    }
}
