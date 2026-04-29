<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Categories
        $tips = \App\Models\ArticleCategory::create([
            'name' => 'Tips',
            'slug' => 'tips',
        ]);
        $review = \App\Models\ArticleCategory::create([
            'name' => 'Review',
            'slug' => 'review',
        ]);
        $news = \App\Models\ArticleCategory::create([
            'name' => 'News',
            'slug' => 'news',
        ]);

        // 2. Create Tags
        $tech = \App\Models\ArticleTag::create(['name' => 'Tech', 'slug' => 'tech']);
        $gaming = \App\Models\ArticleTag::create(['name' => 'Gaming', 'slug' => 'gaming']);
        $monitor = \App\Models\ArticleTag::create(['name' => 'Monitor', 'slug' => 'monitor']);
        $keyboard = \App\Models\ArticleTag::create(['name' => 'Keyboard', 'slug' => 'keyboard']);
        $budget = \App\Models\ArticleTag::create(['name' => 'Budget', 'slug' => 'budget']);

        // 3. Create Articles
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();

        $a1 = \App\Models\Article::create([
            'title' => '5 Tips Memilih Monitor Gaming yang Tepat untuk Budget Mahasiswa',
            'slug' => 'tips-memilih-monitor-gaming-budget-mahasiswa',
            'content' => 'Memilih monitor gaming yang tepat bisa menjadi tantangan tersendiri, terutama bagi mahasiswa yang memiliki budget terbatas. Namun, bukan berarti kamu harus mengorbankan kualitas. Berikut adalah 5 tips yang bisa membantu kamu mendapatkan monitor gaming terbaik sesuai budget. Pertama, perhatikan refresh rate minimal 75Hz. Kedua, pastikan response time di bawah 5ms. Ketiga, pilih panel IPS untuk warna yang akurat. Keempat, ukuran 24 inch sudah cukup untuk kebanyakan setup. Kelima, bandingkan harga di berbagai toko online sebelum membeli.',
            'thumbnail' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop',
            'status' => 'published',
            'user_id' => $user->id,
            'article_category_id' => $tips->id,
        ]);
        $a1->tags()->attach([$tech->id, $gaming->id, $monitor->id, $budget->id]);

        $a2 = \App\Models\Article::create([
            'title' => 'Keyboard Mechanical vs Membrane: Mana yang Lebih Worth It?',
            'slug' => 'keyboard-mechanical-vs-membrane-perbandingan',
            'content' => 'Keyboard mechanical dan membrane memiliki karakteristik yang sangat berbeda. Keyboard mechanical menggunakan switch individual untuk setiap tombol, memberikan feedback yang lebih responsif dan tahan lama. Sementara keyboard membrane menggunakan lapisan membran yang lebih murah untuk diproduksi. Dari segi durabilitas, mechanical keyboard bisa bertahan hingga 50 juta keystroke, sedangkan membrane biasanya hanya 5-10 juta. Namun, membrane keyboard memiliki keunggulan dalam hal harga dan tingkat kebisingan yang lebih rendah.',
            'thumbnail' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop',
            'status' => 'published',
            'user_id' => $user->id,
            'article_category_id' => $review->id,
        ]);
        $a2->tags()->attach([$tech->id, $keyboard->id]);

        $a3 = \App\Models\Article::create([
            'title' => 'Trend Peripheral Gaming 2024: Apa yang Harus Kamu Tahu',
            'slug' => 'trend-peripheral-gaming-2024',
            'content' => 'Tahun 2024 membawa banyak inovasi di dunia peripheral gaming. Trend wireless semakin mendominasi dengan latency yang semakin rendah, membuat perbedaan antara wired dan wireless semakin tipis. Selain itu, teknologi AI mulai diintegrasikan ke dalam mouse dan keyboard untuk adaptive sensitivity dan macro yang lebih pintar. Dari segi desain, trend minimalis dengan build quality premium semakin disukai oleh gamer dan content creator. Monitor dengan refresh rate 240Hz dan 360Hz juga semakin terjangkau.',
            'thumbnail' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
            'status' => 'published',
            'user_id' => $user->id,
            'article_category_id' => $news->id,
        ]);
        $a3->tags()->attach([$tech->id, $gaming->id]);
    }
}
