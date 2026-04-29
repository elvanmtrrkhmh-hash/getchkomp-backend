<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;
use App\Models\Category;
use App\Models\Article;

class HomeController extends Controller
{
    /**
     * Get data for Home Page (Hero, Features, Favorites, Categories, Articles, etc.)
     */
    public function index(): JsonResponse
    {
        // 1. Hero / Banner
        $hero = [
            'title' => 'Temukan Produk Komputer Terbaik',
            'subtitle' => 'Koleksi lengkap, harga bersaing, dan garansi resmi.',
            'image_url' => null, // Placeholder if no DB for hero yet
            'cta_link' => '/products'
        ];

        // 2. Features / Highlights
        $features = [
            [
                'icon' => 'truck',
                'title' => 'Gratis Ongkir',
                'description' => 'Untuk seluruh wilayah Indonesia'
            ],
            [
                'icon' => 'shield',
                'title' => 'Garansi Resmi',
                'description' => 'Produk 100% original bergaransi'
            ],
            [
                'icon' => 'headphones',
                'title' => 'Support 24/7',
                'description' => 'Layanan pelanggan kapan saja'
            ],
            [
                'icon' => 'credit-card',
                'title' => 'Cicilan 0%',
                'description' => 'Bebas bunga dengan kartu kredit'
            ],
        ];

        // 3. Favorite Products (up to 4 items)
        $favoriteProducts = Product::where('isBestseller', true)
                                   ->orWhere('isFeatured', true)
                                   ->latest()
                                   ->take(4)
                                   ->get()
                                   ->map(function ($product) {
                                       return [
                                           'id' => $product->id,
                                           'name' => $product->name,
                                           'slug' => $product->slug ?? \Str::slug($product->name), // Fallback if no slug
                                           'price' => $product->price,
                                           'rating' => $product->rating,
                                           'thumbnail' => $product->thumbnail,
                                           'category_name' => $product->category ? $product->category->name : null,
                                       ];
                                   });

        // 4. Why Choose Us (Reasons)
        $whyChooseUs = [
            'title' => 'Kenapa Memilih Kami?',
            'items' => [
                'Kualitas Terjamin',
                'Pengiriman Cepat',
                'Harga Kompetitif',
                'Pilihan Terlengkap'
            ]
        ];

        // 5. Categories
        // Return active or main categories, we take some or all as no condition is set
        $categories = Category::take(8)->get()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'image_url' => null // Optional placeholder
            ];
        });

        // 6. Latest Articles (Blog)
        $articles = Article::with(['category', 'tags'])
                         ->where('status', 'published')
                         ->latest()
                         ->take(4)
                         ->get()
                         ->map(function ($article) {
                             return [
                                 'id' => $article->id,
                                 'title' => $article->title,
                                 'slug' => $article->slug,
                                 'thumbnail' => $article->thumbnail,
                                 'excerpt' => \Str::limit(strip_tags($article->content), 100),
                                 'published_at' => $article->created_at->format('d M Y'),
                                 'category' => $article->category ? $article->category->name : null,
                                 'tags' => $article->tags->pluck('name'),
                             ];
                         });

        // 7. Testimonials (Apa Kata Mereka)
        $testimonials = [
            [
                'name' => 'Budi Santoso',
                'role' => 'Graphic Designer',
                'content' => 'Pelayanan sangat memuaskan dan produk 100% original. Sangat recommended!'
            ],
            [
                'name' => 'Siti Aminah',
                'role' => 'Programmer',
                'content' => 'Lengkap banget untuk kebutuhan rakit PC. Sukses terus!'
            ],
        ];

        // 8. Footer Data
        $footerData = [
            'about' => 'Tech Komputer Hub adalah pusat belanja kebutuhan komputer terlengkap dan terpercaya.',
            'contact' => [
                'email' => 'support@techkomputer.com',
                'phone' => '+62 812 3456 7890'
            ],
            'social_links' => [
                'facebook' => 'https://facebook.com',
                'instagram' => 'https://instagram.com',
                'twitter' => 'https://twitter.com'
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'hero' => $hero,
                'features' => $features,
                'favorite_products' => $favoriteProducts,
                'why_choose_us' => $whyChooseUs,
                'categories' => $categories,
                'latest_articles' => $articles,
                'testimonials' => $testimonials,
                'footer_data' => $footerData
            ]
        ]);
    }
}
