<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_an_appointment_for_patient()
    {
        $patient = Patient::factory()->create();

        $data = [
            'date' => '2023-10-10',
            'time' => '14:30',
            'status' => 'مكتمل',
            'notes' => 'Test notes'
        ];

        $response = $this->post(
            route('patient.appointments.store', $patient),
            $data
        );

        $response->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'status' => 'مكتمل'
        ]);
    }

    /** @test */
    public function it_validates_appointment_creation()
    {
        $patient = Patient::factory()->create();

        $response = $this->post(
            route('patient.appointments.store', $patient),
            []
        );

        $response->assertSessionHasErrors(['date', 'time', 'status']);
    }
}




