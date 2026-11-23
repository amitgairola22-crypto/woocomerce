import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('Created admin:', admin.email)

  // Sample customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@store.com' },
    update: {},
    create: {
      email: 'customer@store.com',
      name: 'Jane Doe',
      password: customerPassword,
      role: 'customer',
    },
  })
  console.log('Created customer:', customer.email)

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mens' },
      update: {},
      create: {
        name: "Men's",
        slug: 'mens',
        description: "Shop men's clothing and accessories",
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'womens' },
      update: {},
      create: {
        name: "Women's",
        slug: 'womens',
        description: "Shop women's clothing and accessories",
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Complete your look with our accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'footwear' },
      update: {},
      create: {
        name: 'Footwear',
        slug: 'footwear',
        description: 'Premium shoes and sneakers',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        isActive: true,
      },
    }),
  ])
  console.log('Created categories:', categories.map((c) => c.name).join(', '))

  // Products
  const products = [
    {
      name: 'Classic White T-Shirt',
      slug: 'classic-white-t-shirt',
      description: 'A timeless essential. Made from 100% premium cotton.',
      price: 29.99,
      comparePrice: 49.99,
      stock: 100,
      status: 'active' as const,
      featured: true,
      categoryId: categories[0].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'White T-Shirt Front', sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800', alt: 'White T-Shirt Back', sortOrder: 1 },
      ],
    },
    {
      name: 'Premium Denim Jacket',
      slug: 'premium-denim-jacket',
      description: 'Iconic denim jacket with a modern fit. Perfect for any season.',
      price: 129.99,
      comparePrice: 199.99,
      stock: 45,
      status: 'active' as const,
      featured: true,
      categoryId: categories[0].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800', alt: 'Denim Jacket', sortOrder: 0 },
      ],
    },
    {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description: 'Light and breezy floral dress, perfect for warm weather.',
      price: 79.99,
      comparePrice: 119.99,
      stock: 60,
      status: 'active' as const,
      featured: true,
      categoryId: categories[1].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', alt: 'Floral Dress', sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', alt: 'Floral Dress Side', sortOrder: 1 },
      ],
    },
    {
      name: 'Leather Crossbody Bag',
      slug: 'leather-crossbody-bag',
      description: 'Genuine leather crossbody bag with adjustable strap.',
      price: 149.99,
      comparePrice: null,
      stock: 30,
      status: 'active' as const,
      featured: false,
      categoryId: categories[2].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', alt: 'Leather Bag', sortOrder: 0 },
      ],
    },
    {
      name: 'Running Sneakers',
      slug: 'running-sneakers',
      description: 'High-performance running sneakers with cushioned soles.',
      price: 109.99,
      comparePrice: 149.99,
      stock: 75,
      status: 'active' as const,
      featured: true,
      categoryId: categories[3].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'Sneakers', sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800', alt: 'Sneakers Side', sortOrder: 1 },
      ],
    },
    {
      name: 'Slim Fit Chinos',
      slug: 'slim-fit-chinos',
      description: 'Versatile slim-fit chinos that transition from office to weekend.',
      price: 69.99,
      comparePrice: 89.99,
      stock: 80,
      status: 'active' as const,
      featured: false,
      categoryId: categories[0].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', alt: 'Chinos', sortOrder: 0 },
      ],
    },
    {
      name: 'Oversized Hoodie',
      slug: 'oversized-hoodie',
      description: 'Ultra-soft oversized hoodie for ultimate comfort.',
      price: 89.99,
      comparePrice: 119.99,
      stock: 55,
      status: 'active' as const,
      featured: false,
      categoryId: categories[1].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800', alt: 'Hoodie', sortOrder: 0 },
      ],
    },
    {
      name: 'Silk Blouse',
      slug: 'silk-blouse',
      description: 'Luxurious silk blouse with a flattering drape.',
      price: 95.99,
      comparePrice: 140.00,
      stock: 35,
      status: 'active' as const,
      featured: true,
      categoryId: categories[1].id,
      images: [
        { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=800', alt: 'Silk Blouse', sortOrder: 0 },
      ],
    },
  ]

  for (const product of products) {
    const { images, ...productData } = product
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        tags: JSON.stringify(['new', 'trending']),
        images: {
          create: images,
        },
        attributes: {
          create: [
            { name: 'Color', values: JSON.stringify(['Black', 'White', 'Navy']) },
            { name: 'Size', values: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']) },
          ],
        },
      },
    })
    console.log('Created product:', created.name)
  }

  // Banners
  const bannerCount = await prisma.banner.count()
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: 'New Season Arrivals',
          subtitle: 'Discover the latest trends in fashion',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
          link: '/products',
          buttonText: 'Shop Now',
          position: 'hero',
          sortOrder: 0,
          isActive: true,
        },
        {
          title: 'Summer Collection',
          subtitle: 'Up to 40% off selected styles',
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600',
          link: '/products?sort=featured',
          buttonText: 'Explore',
          position: 'hero',
          sortOrder: 1,
          isActive: true,
        },
      ],
    })
  }

  // Site settings
  const settings = [
    { key: 'store_name', value: 'LuxeShop', group: 'general' },
    { key: 'store_tagline', value: 'Premium Fashion & Lifestyle', group: 'general' },
    { key: 'store_email', value: 'hello@luxeshop.com', group: 'general' },
    { key: 'store_phone', value: '+1 (555) 000-0000', group: 'general' },
    { key: 'currency_code', value: 'USD', group: 'general' },
    { key: 'currency_symbol', value: '$', group: 'general' },
    { key: 'free_shipping_threshold', value: '100', group: 'shipping' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'percentage',
      value: 10,
      minOrderValue: 50,
      isActive: true,
    },
  })

  // Default shipping zone
  const shippingZone = await prisma.shippingZone.create({
    data: {
      name: 'United States',
      countries: JSON.stringify(['US']),
      rates: {
        create: [
          { name: 'Standard Shipping', type: 'flat', price: 9.99, isActive: true },
          { name: 'Express Shipping', type: 'flat', price: 19.99, isActive: true },
          { name: 'Free Shipping (orders over $100)', type: 'free', price: 0, minOrderValue: 100, isActive: true },
        ],
      },
    },
  })
  console.log('Created shipping zone:', shippingZone.name)

  console.log('Seeding complete!')
  console.log('\n--- Login credentials ---')
  console.log('Admin: admin@store.com / admin123')
  console.log('Customer: customer@store.com / customer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
