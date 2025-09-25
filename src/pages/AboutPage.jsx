export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    About React Pro Shop
                </h1>
                
                <div className="prose prose-lg mx-auto">
                    <p className="text-lg text-gray-600 mb-6">
                        Welcome to React Pro Shop, your trusted partner in providing high-quality products 
                        and exceptional customer service. Founded with a passion for excellence, we strive 
                        to bring you the best shopping experience possible.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                            <p className="text-gray-600">
                                To provide customers with premium products at competitive prices while 
                                maintaining the highest standards of quality and customer service.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                            <p className="text-gray-600">
                                To become the leading online destination for customers seeking quality, 
                                reliability, and exceptional value in their shopping experience.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-12 bg-blue-50 p-8 rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Carefully curated product selection</li>
                            <li>Secure and fast payment processing</li>
                            <li>24/7 customer support</li>
                            <li>Fast and reliable shipping</li>
                            <li>Easy returns and refunds</li>
                            <li>User-friendly shopping experience</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}