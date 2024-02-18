package entity

import "github.com/google/uuid"

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func NewCategory(name string) *Category {
	return &Category{
		ID:   uuid.New().String(),
		Name: name,
	}
}

type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	CategoryID  string  `json:"category_id` // poderia ser Category*
	ImageURL    string  `json:"image_url"`
	Price       float64 `json:"price"`
}

func NewProduct(name string, description string, categoryID, imageURL string, price float64) *Product {
	return &Product{
		ID:          uuid.NewString(),
		Name:        name,
		Description: description,
		CategoryID:  categoryID,
		ImageURL:    imageURL,
		Price:       price,
	}
}
