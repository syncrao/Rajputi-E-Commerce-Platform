from django.db import models
from cloudinary.models import CloudinaryField
from django.conf import settings

PRODUCT_TYPES = [
    ("ready_dress", "Ready Dress"),
    ("fabric_only", "Fabric Only"),
]

CATEGORY_CHOICES = [
    ("poshak", "Poshak"),
    ("dupatta", "Dupatta"),
    ("suit", "Suit"),
    ("odhna", "Odhna"),
]

FABRIC_CHOICES = [
    ("cotton", "Cotton"),
    ("silk", "Silk"),
    ("georgette", "Georgette"),
    ("velvet", "Velvet"),
]

SIZE_CHOICES = [
    ("s", "Small"),
    ("m", "Medium"),
    ("l", "Large"),
    ("xl", "Extra Large"),
    ("xxl", "2XL"),
]

COLOR_CHOICES = [
    ("red", "Red"),
    ("blue", "Blue"),
    ("green", "Green"),
    ("yellow", "Yellow"),
    ("black", "Black"),
    ("white", "White"),
]

FEEDBACK_CHOICES = [
    ("tight", "Tight"),
    ("a_little_tight", "A Little Tight"),
    ("just_right", "Just Right"),
    ("a_little_loose", "A Little Loose"),
    ("loose", "Loose"),
]

LENGTH_CHOICES = [
    ("short", "Short"),
    ("a_little_short", "A Little Short"),
    ("just_right", "Just Right"),
    ("a_little_long", "A Little Long"),
    ("long", "Long"),
]

TRANSPARENCY_CHOICES = [
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High"),
]


class Product(models.Model):
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    fabric = models.CharField(max_length=50, choices=FABRIC_CHOICES)

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
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
        return f"{self.product.name} - {self.size} - {self.color} ({self.quantity})"


class ProductRating(models.Model):
    product = models.ForeignKey(Product, related_name="ratings", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} Rating by {self.user.username}"
