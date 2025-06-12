<?php
namespace Tests\Feature;

use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientControllerTest extends TestCase
{
    use RefreshDatabase; // Reset database after each test

    /** @test */
    public function it_lists_patients_with_search()
    {
        // Create test data
        $patient1 = Patient::factory()->create(['name' => 'Ali Hassan']);
        $patient2 = Patient::factory()->create(['name' => 'Omar Ahmed']);

        // Test search by name
        $response = $this->get(route('patient.index', ['name' => 'Ali']));

        // Assertions
        $response->assertInertia(
            fn ($page) => $page
                ->component('Patient/Index')
                ->where('patients.data.0.name', 'Ali Hassan')
                ->missing('patients.data.1.name', 'Omar Ahmed')
        );
    }

    /** @test */
    public function it_stores_a_new_patient()
    {
        $data = [
            'name' => 'New Patient',
            'file_number' => 'PA-123',
            'phone' => '0123456789'
        ];

        $response = $this->post(route('patient.store'), $data);

        $response->assertRedirect(route('patient.index'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('patients', ['name' => 'New Patient']);
    }

    /** @test */
    public function it_shows_patient_details_with_appointments()
    {
        $patient = Patient::factory()->create();
        $appointment = $patient->appointments()->create([
            'date' => now(),
            'time' => '10:00',
            'status' => 'مجدول'
        ]);

        $response = $this->get(route('patient.show', $patient));

        $response->assertInertia(
            fn ($page) => $page
                ->component('Patient/Show')
                ->has('appointments.data.0', fn ($appointmentPage) => 
                    $appointmentPage->where('id', $appointment->id)->etc()
                )
        );
    }
}
