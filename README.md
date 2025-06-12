# 🌟 **DentaCare: Open-Source Dental Clinic Management System**  
**Empowering dental practices with modern, intuitive patient management**
## 🚀 **Why DentaCare?**  
DentaCare is a **fully functional dental clinic management system** built with Laravel and React.js. Designed as an **educational open-source project**, it demonstrates modern full-stack development patterns while solving real-world healthcare challenges. Perfect for students to learn industry-grade architecture!

## ✨ **Core Features**  

### 👨‍⚕️ **Patient Management**  
- Complete patient profiles with medical history  
- Smart search by name/file number/phone  
- Unified dashboard showing appointments + treatments  

```php
// PatientController.php
public function show(Patient $patient)
{
    return inertia('Patient/Show', [
        'patient' => new PatientResource($patient),
        'appointments' => $patient->appointments()->with(['treatments.payments'])->get(),
        'treatments' => $patient->treatmentRecords()->with(['payments'])->take(5)->get()
    ]);
}
```

### 📅 **Intelligent Scheduling**  
- Interactive calendar with drag-and-drop  
- Appointment status tracking (Scheduled/Completed/Cancelled)  
- Conflict-free scheduling system  

```php
// AppointmentController.php
public function index()
{
    $appointments = Appointment::with('patient')
        ->whereMonth('date', now()->month)
        ->orderBy('date')
        ->orderBy('time')
        ->paginate(100);
}
```

### 💰 **Treatment & Payment Tracking**  
- Tooth-specific treatment plans  
- Payment status tracking (Paid/Partial/Unpaid)  
- Automatic payment status updates  

```php
// PaymentController.php
public function store(Request $request, Patient $patient)
{
    $treatment->update(['payment_status' => $status]); // Auto-updates status
}
```

### 📊 **Real-Time Dashboard**  
- Clinic performance analytics  
- Today's appointments overview  
- Financial metrics at a glance  

```php
// DashboardController.php
public function index()
{
    return Inertia::render('Dashboard', [
        'stats' => [
            'totalPatients' => Patient::count(),
            'appointmentsToday' => Appointment::whereDate('date', $today)->count(),
            'unpaidTreatments' => TreatmentRecord::where('payment_status', '!=', 'paid')->count(),
        ]
    ]);
}
```

## 🛠 **Tech Stack**  

| **Layer**       | **Technology**   | **Key Files**                          |
|-----------------|------------------|----------------------------------------|
| **Frontend**    | React + Inertia  | `resources/js/Pages/*`                 |
| **Backend**     | Laravel 11       | `app/Http/Controllers/*`               |
| **Database**    | MySQL            | `app/Models/*`                         |
| **Search**      | Laravel Scout    | `PatientSearchController.php`          |
| **Auth**        | Laravel Breeze  | `ProfileController.php`                |

## 🚀 **Getting Started**  

### Prerequisites  
- PHP 8.1+  
- Node.js 18+  
- MySQL 5.7+  
### Installation  
```bash
# Clone repository
git clone https://github.com/Kamel-AK/DentaCare.git

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start development
php artisan serve
npm run dev
```

## 🌟 **Learning Highlights**  

### 🔄 **Inertia.js Integration**  
Seamless React-Laravel communication without API boilerplate:  
```php
// Returns data directly to React components
return Inertia::render('Dashboard', [ 'stats' => [...] ]);
```

### 🔍 **Smart Search System**  
Full-text patient search implementation:  
```php
// PatientSearchController.php
public function search(Request $request)
{
    $patients = Patient::search($query)
        ->orderBy('created_at', 'desc')
        ->take(20)
        ->get();
}
```

### 💳 **Payment Workflow**  
Automated payment status handling:  
```php
// PaymentController.php
$totalPaid = $treatment->payments()->sum('amount');
if($totalPaid >= $treatment->cost) {
    $status = 'paid';
} // Auto-updates treatment status
```

## 🤝 **Contribution Guide**  
**This project welcomes all learners!** Here's how to contribute:

1. **Fork** the repository  
2. Create a feature branch: `git checkout -b feature/your-feature`  
3. Commit changes: `git commit -m 'Add amazing feature'`  
4. **Push** to branch: `git push origin feature/your-feature`  
5. Open a **pull request**

> 🚫 **Important:** This project is for **educational purposes only**. Commercial use is prohibited.

## 📜 **License**  
DentaCare is [MIT licensed](LICENSE) - free for learning and personal use.

---

**Join our mission to revolutionize dental care management!**  
💻 **Contribute now**: [https://github.com/Kamel-AK/DentaCare.git](https://github.com/Kamel-AK/DentaCare.git)  
📧 **Questions?**: kamel.alkhiami1@gmail.com 

> "The best way to learn is by building solutions that solve real problems. DentaCare opens that door for every aspiring developer."  
> *- Project Maintainers*  
