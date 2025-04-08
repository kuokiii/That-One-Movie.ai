import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class CinematicBrainEngine:
    def __init__(self, movies_path, ratings_path=None):
        """
        Initialize the recommendation engine with movie data
        
        Parameters:
        movies_path (str): Path to the movies CSV file
        ratings_path (str): Path to the ratings CSV file (optional)
        """
        self.movies = pd.read_csv(movies_path)
        
        # Clean and preprocess data
        self.preprocess_movies()
        
        # If ratings are provided, load them for collaborative filtering
        if ratings_path:
            self.ratings = pd.read_csv(ratings_path)
            self.user_movie_matrix = self.create_user_movie_matrix()
        else:
            self.ratings = None
            self.user_movie_matrix = None
        
        # Create content-based filtering model
        self.content_model = self.create_content_model()
        
    def preprocess_movies(self):
        """Clean and preprocess the movie data"""
        # Extract year from title
        self.movies['year'] = self.movies['title'].str.extract(r'$$(\d{4})$$$')
        self.movies['title'] = self.movies['title'].str.replace(r'\s*$$\d{4}$$$', '', regex=True)
        
        # Create a combined features column for content-based filtering
        self.movies['combined_features'] = self.movies['genres']
        
        # Fill NaN values
        self.movies['combined_features'] = self.movies['combined_features'].fillna('')
    
    def create_content_model(self):
        """Create a content-based filtering model using TF-IDF and cosine similarity"""
        # Create TF-IDF vectorizer
        tfidf = TfidfVectorizer(stop_words='english')
        
        # Construct the TF-IDF matrix
        tfidf_matrix = tfidf.fit_transform(self.movies['combined_features'])
        
        # Compute cosine similarity between movies
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        return {
            'tfidf_vectorizer': tfidf,
            'tfidf_matrix': tfidf_matrix,
            'cosine_sim': cosine_sim
        }
    
    def create_user_movie_matrix(self):
        """Create a user-movie matrix for collaborative filtering"""
        # Create a pivot table: users as rows, movies as columns, ratings as values
        user_movie_df = self.ratings.pivot(
            index='userId',
            columns='movieId',
            values='rating'
        ).fillna(0)
        
        return user_movie_df
    
    def get_content_based_recommendations(self, movie_title, top_n=10):
        """
        Get content-based recommendations based on movie similarity
        
        Parameters:
        movie_title (str): Title of the movie to base recommendations on
        top_n (int): Number of recommendations to return
        
        Returns:
        list: List of recommended movie dictionaries
        """
        # Find the movie in our dataset
        movie_idx = self.movies[self.movies['title'].str.lower() == movie_title.lower()].index
        
        if len(movie_idx) == 0:
            # If exact match not found, try partial match
            movie_idx = self.movies[self.movies['title'].str.lower().str.contains(movie_title.lower())].index
            
            if len(movie_idx) == 0:
                return []
        
        movie_idx = movie_idx[0]
        
        # Get similarity scores for this movie with all others
        sim_scores = list(enumerate(self.content_model['cosine_sim'][movie_idx]))
        
        # Sort movies by similarity score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N most similar movies (excluding the input movie)
        sim_scores = sim_scores[1:top_n+1]
        
        # Get movie indices
        movie_indices = [i[0] for i in sim_scores]
        
        # Return the top movies as dictionaries
        recommendations = self.movies.iloc[movie_indices].to_dict('records')
        
        return recommendations
    
    def get_collaborative_recommendations(self, user_id, top_n=10):
        """
        Get collaborative filtering recommendations based on user similarity
        
        Parameters:
        user_id (int): User ID to get recommendations for
        top_n (int): Number of recommendations to return
        
        Returns:
        list: List of recommended movie dictionaries
        """
        if self.user_movie_matrix is None:
            return []
        
        if user_id not in self.user_movie_matrix.index:
            return []
        
        # Get the user's ratings
        user_ratings = self.user_movie_matrix.loc[user_id]
        
        # Find similar users
        user_similarities = cosine_similarity(
            self.user_movie_matrix.loc[user_id].values.reshape(1, -1),
            self.user_movie_matrix.values
        )[0]
        
        # Get top similar users (excluding the user themselves)
        similar_users_indices = np.argsort(user_similarities)[::-1][1:11]  # Top 10 similar users
        similar_users = self.user_movie_matrix.iloc[similar_users_indices]
        
        # Get movies the user hasn't rated
        unrated_movies = user_ratings[user_ratings == 0].index
        
        # Calculate predicted ratings for unrated movies
        predicted_ratings = {}
        
        for movie_id in unrated_movies:
            # Get ratings from similar users for this movie
            similar_users_ratings = similar_users[movie_id]
            
            # Skip if no similar user rated this movie
            if similar_users_ratings.sum() == 0:
                continue
            
            # Calculate weighted rating based on user similarity
            weights = user_similarities[similar_users_indices]
            predicted_rating = np.dot(similar_users_ratings, weights) / weights.sum()
            
            predicted_ratings[movie_id] = predicted_rating
        
        # Sort movies by predicted rating
        recommended_movie_ids = sorted(predicted_ratings.items(), key=lambda x: x[1], reverse=True)[:top_n]
        recommended_movie_ids = [movie_id for movie_id, _ in recommended_movie_ids]
        
        # Get movie details
        recommendations = self.movies[self.movies['movieId'].isin(recommended_movie_ids)].to_dict('records')
        
        return recommendations
    
    def save_model(self, filepath):
        """Save the model to a file"""
        with open(filepath, 'wb') as f:
            pickle.dump({
                'content_model': self.content_model,
                'user_movie_matrix': self.user_movie_matrix
            }, f)
    
    @classmethod
    def load_model(cls, model_path, movies_path):
        """Load a pre-trained model"""
        # Initialize with just the movies data
        engine = cls(movies_path)
        
        # Load the pre-trained model components
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
            
        engine.content_model = model_data['content_model']
        engine.user_movie_matrix = model_data['user_movie_matrix']
        
        return engine


# Example usage
if __name__ == "__main__":
    # Initialize the engine with MovieLens data
    engine = CinematicBrainEngine(
        movies_path='movies.csv',
        ratings_path='ratings.csv'
    )
    
    # Get content-based recommendations
    recommendations = engine.get_content_based_recommendations("The Dark Knight", top_n=5)
    print("Content-based recommendations for 'The Dark Knight':")
    for movie in recommendations:
        print(f"- {movie['title']} ({movie['year']})")
    
    # Get collaborative recommendations for a user
    user_recommendations = engine.get_collaborative_recommendations(user_id=42, top_n=5)
    print("\nCollaborative recommendations for user 42:")
    for movie in user_recommendations:
        print(f"- {movie['title']} ({movie['year']})")
    
    # Save the model for future use
    engine.save_model('cinematic_brain_model.pkl')
