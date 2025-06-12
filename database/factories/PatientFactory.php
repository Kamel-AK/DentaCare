<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Patient::class;

    private array $arabicFirstNames = [
        'محمد', 'أحمد', 'عمر', 'علي', 'يوسف', 'خالد', 'عبدالله', 'حسن',
        'إبراهيم', 'عبدالرحمن', 'زياد', 'سعد', 'فهد', 'عبدالعزيز',
        'فاطمة', 'نور', 'سارة', 'ريم', 'مريم', 'لينا', 'رنا', 'هدى',
        'عائشة', 'زينب', 'سلمى', 'ليلى', 'رغد', 'جنى', 'لجين'
    ];

    private array $arabicLastNames = [
        'الأحمد', 'المحمد', 'العمري', 'السيد', 'الخالد', 'الحسن', 'العلي',
        'السالم', 'الحامد', 'الراشد', 'المالكي', 'القحطاني', 'الغامدي',
        'الدوسري', 'الشمري', 'العتيبي', 'الزهراني', 'الشهري', 'البلوي'
    ];
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['M','F']);
        // get random arabic name 
        $firstName = $this->faker->randomElement($this->arabicFirstNames);
        $lastName = $this->faker->randomElement($this->arabicLastNames);

        return [
            'name'=>$firstName.' '.$lastName,
            'contact_info' => $this->faker->numerify('09########'),// Syria mobile format
            'address' => $this->faker->address,
            'age' => $this->faker->numberBetween(20, 60),
            'gender' => $gender,
            'medical_history' => $this->faker->paragraph(),
            'file_number' => $this->faker->unique()->numberBetween(1, 9999),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now')
        ];
    }
}
