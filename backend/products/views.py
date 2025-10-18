from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max, Avg, Count
from .models import Product, ProductInventory, ProductRating
from django.http import JsonResponse
from .serializers import ProductRatingSerializer, ProductListSerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductListSerializer  
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"


class ProductLastUpdatedView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        agg = Product.objects.aggregate(
            last_updated=Max("updated_at"),
            count=Count("id")
        )
        return Response(agg)


def inventory(request, product_id):
    inventories = ProductInventory.objects.filter(product_id=product_id).values(
        'id',
        'product_id',
        'size',
        'color',
        'quantity'
    )
    return JsonResponse(list(inventories), safe=False)



class ProductRatingListCreateView(generics.ListCreateAPIView):
    """
    GET: List all ratings for a product.
    POST: Add a new rating for a product.
    """
    serializer_class = ProductRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        return ProductRating.objects.filter(product_id=product_id).order_by("-created_at")

    def perform_create(self, serializer):
        product_id = self.kwargs.get("product_id")
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)


class ProductRatingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET / PUT / DELETE a single rating (by ID)
    """
    queryset = ProductRating.objects.all()
    serializer_class = ProductRatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        if self.get_object().user != self.request.user:
            return Response({"error": "You can only edit your own review."}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            return Response({"error": "You can only delete your own review."}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()


class ProductRatingSummaryView(generics.RetrieveAPIView):
    """
    Returns average rating and total number of ratings for a product.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, product_id):
        summary = ProductRating.objects.filter(product_id=product_id).aggregate(
            avg_rating=Avg("rating"),
            total_reviews=Count("id")
        )
        summary["avg_rating"] = round(summary["avg_rating"] or 0, 1)
        return Response(summary)
