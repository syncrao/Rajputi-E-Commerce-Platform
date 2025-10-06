from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Max, Count
from .models import Product, ProductInventory
from django.http import JsonResponse
from .serializers import ProductListSerializer


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