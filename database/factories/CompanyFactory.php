<?php

namespace Database\Factories;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use MongoDB\BSON\ObjectId;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory {

    protected $model = Company::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {

        $name = $this->faker->company;
        $slug = $this->generateSlug($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'owner' => new ObjectId(),
            'subgroups' => [],
            'groups' => [],
            'availableModes' => [
                'education' => false,
                'omnibox' => false,
                'supermenu' => true
            ],
            'omnitricks' => [
                'hideBypassShowProducts' => true
            ],
            'prepaidEnabled' => false,
            'driveThruEnabled' => false,
            'allowAllBranchesView' => true,
            'bannerHeader' => [
                'slideImageSpeed' => 4672,
                'slideImageEnabled' => true,
                'image' => []
            ],
            'hideCategoriesMenu' => true,
            'isFacebookLoginInactive' => false,
            'isCompanyActive' => true,
            'loyalty' => [
                'points' => [
                    'disabled' => false,
                    'rate' => 1
                ]
            ],
            'invoices' => [],
            'branches' => [
                new ObjectId(),
                new ObjectId(),
                new ObjectId(),
                new ObjectId(),
                new ObjectId()
            ],
            'employee' => [],
            'locationTypes' => [
                1,
                2,
                8
            ],
            'proximityRadiusTakeAway' => 1000,
            'proximityRadiusTakeAwayActive' => true,
            'settingsTotem' => [
                'printerId' => 3,
                'primaryColor' => $this->faker->hexColor,
                'secundaryColor' => $this->faker->hexColor,
                'layout' => 'Transparente',
                'columns' => '2',
                'customerNameFormat' => 2,
                'consumeTypeBackground' => $this->faker->hexColor,
                'selectPaymentBackground' => $this->faker->hexColor,
                'consumeTypes' => [
                    [
                        '_id' => new ObjectId(),
                        'value' => 1,
                        'active' => true,
                        'text' => $this->faker->paragraph,
                        'icon' => $this->faker->url
                    ],
                    [
                        '_id' => new ObjectId(),
                        'value' => 2,
                        'active' => true,
                        'text' => $this->faker->paragraph,
                        'icon' => $this->faker->url
                    ]
                ],
                'imageSize' => 'cover',
                'allowPrinting' => false,
                'screenOrientation' => 'portrait',
                'modalFontColor' => $this->faker->hexColor,
                'waitingBgColor' => $this->faker->hexColor,
                'moneyPaymentText' => $this->faker->paragraph,
                'paperSize' => 'mm80',
                'printNote' => $this->faker->paragraph
            ],
            'settings' => [
                'currency' => 'BRL',
                'ourStoresText' => 'Nossas Lojas',
                'driveThruInfo' => 'Placa/número',
                'driveThruText' => 'Drive-thru',
                'onStoreText' => $this->faker->paragraph,
                'toGoText' => $this->faker->paragraph,
                'deliveryText' => $this->faker->paragraph,
                'whatsAppVerifier' => false,
                'screenOrientation' => 'portrait',
                'icon512' => $this->faker->url,
                'headerLogo' => $this->faker->url,
                'primaryColor' => $this->faker->hexColor,
                'secundaryColor' => $this->faker->hexColor,
                'reports' => [
                    'totemCheckIn' => false
                ]
            ],
            'blocksAndApartments' => [],
            'deliveryindoorUserTypes' => [],
            'faceRecognition' => true,
            'noAuthOrder' => false,
            '__v' => 0,
            'layout' => 'Lista',
            'iconMenu' => 'material-local_mall',
            'appUrl' => $this->faker->url,
            'customMapsApiKeys' => [],
            'integrations' => [],
            'marketplaceAccount' => [],
            'minAppVersion' => [
                'mobile' => '1.0.0'
            ],
            'settingsOneSignal' => []
        ];
    }

    private function generateSlug(string $value) {
        $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        $value = strtolower($value);
        $value = str_replace(' ', '-', $value);
        $value = preg_replace('/[^a-z0-9\-]/', '', $value);
        $value = preg_replace('/-+/', '-', $value);
        $value = trim($value, '-');

        return $value;
    }
}
