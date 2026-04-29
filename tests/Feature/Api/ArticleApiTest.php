<?php

namespace Tests\Feature\Api;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_published_articles()
    {
        $user = User::factory()->create();
        
        Article::factory()->count(5)->create([
            'status' => 'published',
            'user_id' => $user->id,
        ]);

        Article::factory()->create([
            'status' => 'draft',
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'articles.data')
            ->assertJsonPath('articles.meta.total', 5);
    }

    public function test_can_show_article_by_slug()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create([
            'status' => 'published',
            'user_id' => $user->id,
            'slug' => 'test-article-slug',
        ]);

        $response = $this->getJson("/api/articles/{$article->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('article.slug', 'test-article-slug')
            ->assertJsonPath('status', 'success');
    }

    public function test_cannot_show_draft_article()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create([
            'status' => 'draft',
            'user_id' => $user->id,
            'slug' => 'draft-article',
        ]);

        $response = $this->getJson("/api/articles/{$article->slug}");

        $response->assertStatus(404);
    }
}
