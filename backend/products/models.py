from django.db import models
from cloudinary.models import CloudinaryField
from django.conf import settings


CATEGORY_CHOICES = [
    ("Poshak", "Poshak"),
    ("Dupatta", "Dupatta"),
    ("Suit", "Suit"),
    ("Odhna", "Odhna"),
    ("Lehenga", "Lehenga"),
]

FABRIC_CHOICES = [
    ("Cotton", "Cotton"),
    ("Silk", "Silk"),
    ("Georgette", "Georgette"),
    ("Velvet", "Velvet"),
]

SIZE_CHOICES = [
    ("S", "Small"),
    ("M", "Medium"),
    ("L", "Large"),
    ("XL", "Extra Large"),
    ("XXL", "2XL"),
]

COLOR_CHOICES = [
    ("Red", "Red"),
    ("Blue", "Blue"),
    ("Green", "Green"),
    ("Yellow", "Yellow"),
    ("Black", "Black"),
    ("White", "White"),
]

FEEDBACK_CHOICES = [
    ("Tight", "Tight"),
    ("A Little Tight", "A Little Tight"),
    ("Just Right", "Just Right"),
    ("A Little Loose", "A Little Loose"),
    ("Loose", "Loose"),
]

LENGTH_CHOICES = [
    ("Short", "Short"),
    ("A Little Short", "A Little Short"),
    ("Just Right", "Just Right"),
    ("A Little Long", "A Little Long"),
    ("Long", "Long"),
]

TRANSPARENCY_CHOICES = [
    ("Low", "Low"),
    ("Medium", "Medium"),
    ("High", "High"),
]


class Product(models.Model):
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    fabric = models.CharField(max_length=50, choices=FABRIC_CHOICES)

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)  
    mrp = models.DecimalField(max_digits=10, decimal_places=2)   

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = CloudinaryField("image")
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.name} Image"


class ProductInventory(models.Model):
    product = models.ForeignKey(Product, related_name="inventories", on_delete=models.CASCADE)
    size = models.CharField(max_length=5, choices=SIZE_CHOICES, blank=True, null=True)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("product", "size", "color")

    def __str__(self):
        return f"{self.product.id} - {self.product.name} - {self.size} - {self.color} ({self.quantity})"


class ProductRating(models.Model):
    product = models.ForeignKey(Product, related_name="ratings", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} Rating by {self.user.username}"
