import { Section } from '../types';

export const surveySections: Section[] = [
  {
    id: 'vision',
    title: 'Vision & Business Priorities',
    description: "Let's start with the big picture to align our design with your business goals.",
    questions: [
      {
        id: 'q1',
        type: 'single',
        title: 'What is your primary goal for this website redesign?',
        description: 'Example: "I want to increase monthly sales," or "I want to improve our brand image."',
        required: true,
        options: [
          { label: '⭐ Get more customer orders and quote requests', value: 'orders' },
          { label: '📱 Make it easier for customers to buy products', value: 'ease_of_use' },
          { label: '🔍 Rank higher on Google for "Fosroc distributor Kenya"', value: 'seo' },
          { label: '💼 Look more professional than competitors', value: 'brand' },
          { label: '📞 Make it easier for customers to contact us', value: 'contact' },
          { label: 'Something else', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q2',
        type: 'single',
        title: 'When a user visits the site, what is the ideal action they should take?',
        description: 'Example: A contractor searches for waterproofing, lands on your site, and immediately requests a quote.',
        required: true,
        options: [
          { label: 'They find the product and request a quote immediately', value: 'quote_immediate' },
          { label: 'They call or WhatsApp you for advice', value: 'contact_advice' },
          { label: 'They browse products and save your contact for later', value: 'browse_save' },
          { label: 'They add products to cart and buy online', value: 'ecommerce_buy' },
          { label: 'They download product information and contact you later', value: 'info_download' },
        ]
      },
      {
        id: 'q3',
        type: 'multiple',
        title: "Which aspects of your current website are working well and should be retained?",
        description: 'Example: "Our current logo placement is good," or "The product list is accurate."',
        options: [
          { label: 'The product range we show', value: 'product_range' },
          { label: 'The Fosroc branding and badge', value: 'fosroc_branding' },
          { label: 'The color scheme (red, blue, gray)', value: 'color_scheme' },
          { label: 'The contact information layout', value: 'contact_layout' },
          { label: 'The "Your Project. Our Passion." tagline', value: 'tagline' },
          { label: 'The overall structure/organization', value: 'structure' },
          { label: 'Nothing - let\'s start fresh', value: 'nothing' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q4',
        type: 'multiple',
        title: "Which aspects of your current website are NOT working and need improvement?",
        description: 'Example: "It looks bad on mobile phones," or "Clients can\'t find the phone number."',
        options: [
          { label: 'Hard to find products quickly', value: 'hard_find' },
          { label: 'Doesn\'t look professional enough', value: 'unprofessional' },
          { label: 'Too much focus on technical documents', value: 'too_technical' },
          { label: 'Not enough product information', value: 'scarce_info' },
          { label: 'Difficult to contact us', value: 'hard_contact' },
          { label: 'Doesn\'t work well on phones', value: 'bad_mobile' },
          { label: 'Not showing up on Google searches', value: 'bad_seo' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q5',
        type: 'ranking',
        title: 'How do your customers currently find your business?',
        description: 'Please rank these from most common (Top) to least common (Bottom).',
        options: [
          { label: 'Google search', value: 'google' },
          { label: 'Social media (Facebook, Instagram, LinkedIn)', value: 'social' },
          { label: 'Referrals from other contractors/businesses', value: 'referrals' },
          { label: 'Repeat customers who already know us', value: 'repeat' },
          { label: 'Phone directory or online listings', value: 'directory' },
          { label: 'Walk-ins to our physical location', value: 'walkins' },
        ]
      }
    ]
  },
  {
    id: 'homepage',
    title: 'Homepage - First Impressions',
    description: 'Your homepage is your storefront window. We need to decide what goes in the display.',
    questions: [
      {
        id: 'q6',
        type: 'ranking',
        title: 'What content should be most visible when a customer first lands on the homepage?',
        description: 'Rank your top 3 priorities to determine the layout hierarchy.',
        options: [
          { label: 'Large "Get A Quote" button', value: 'quote_btn' },
          { label: 'Featured products with prices', value: 'featured_products' },
          { label: 'Contact options (WhatsApp, Phone, Location)', value: 'contact_opts' },
          { label: '"In Stock" product availability', value: 'stock_status' },
          { label: 'Special offers or promotions', value: 'offers' },
          { label: 'Customer testimonials/reviews', value: 'testimonials' },
          { label: 'Photos of completed projects', value: 'projects' },
          { label: 'Company credentials (5+ years, etc.)', value: 'credentials' },
        ]
      },
      {
        id: 'q7',
        type: 'multiple',
        title: 'Which call-to-action buttons are most critical for your users?',
        description: 'Select up to 3 actions you want users to take immediately.',
        options: [
          { label: 'Get A Quote (form)', value: 'quote' },
          { label: 'WhatsApp Us (direct message)', value: 'whatsapp' },
          { label: 'Call Now (click-to-call)', value: 'call' },
          { label: 'Email Us', value: 'email' },
          { label: 'Add to Cart / Buy Online', value: 'cart' },
          { label: 'Get Directions', value: 'directions' },
          { label: 'Download Product Catalog', value: 'catalog' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q8',
        type: 'single',
        title: 'How prominent should the Fosroc "Authorised Distributor" badge be?',
        description: 'Example: Should it be the first thing they see, or tucked in the footer?',
        required: true,
        options: [
          { label: '⭐ Make it VERY prominent - this is our main credibility', value: 'prominent' },
          { label: '✓ Keep it visible but not too large', value: 'visible' },
          { label: '↓ Show it but make it subtle (footer/sidebar)', value: 'subtle' },
          { label: '❌ Remove it - focus on other things', value: 'remove' },
          { label: '🤷 Not sure - you decide', value: 'unsure' },
        ]
      },
      {
        id: 'q9',
        type: 'single',
        title: 'Do you want to keep the tagline "Your Project. Our Passion."?',
        description: 'Example: You might feel it represents you well, or you might want something more modern.',
        required: true,
        options: [
          { label: '❤️ Love it - keep it prominent', value: 'keep_prominent' },
          { label: '✓ Keep it but make it smaller', value: 'keep_small' },
          { label: '🔄 Change it to something else', value: 'change', isOther: true },
          { label: '❌ Remove it completely', value: 'remove' },
          { label: '🤷 Not sure - you decide', value: 'unsure' },
        ]
      },
      {
        id: 'q10',
        type: 'single',
        title: 'Should we display business statistics on the homepage to build trust?',
        description: 'Example: "Over 150+ Satisfied Clients" or "5+ Years in Business".',
        options: [
          { label: 'Yes - these numbers build trust', value: 'yes' },
          { label: 'Yes - but different numbers', value: 'yes_custom', isOther: true },
          { label: 'No - focus on products instead', value: 'no' },
        ],
        subQuestions: [
          {
            id: 'q10_details',
            conditionalId: 'q10',
            conditionalValue: ['yes', 'yes_custom'],
            type: 'text',
            title: 'Please list the statistics we should display:',
            placeholder: 'e.g., 10 Years Experience, 500+ Projects supplied...'
          }
        ]
      },
      {
        id: 'q11',
        type: 'single',
        title: 'What is the main headline message for the top banner (Hero Section)?',
        description: 'This is the big text overlaying the main image at the top of the site.',
        required: true,
        options: [
          { label: '🏗️ "Kenya\'s Authorised Fosroc Distributor..."', value: 'distributor' },
          { label: '🚚 "Fast Delivery of Quality Construction Chemicals..."', value: 'delivery' },
          { label: '💪 "Your Trusted Partner for Fosroc & Gyproc..."', value: 'partner' },
          { label: '📦 "In-Stock Construction Chemicals Ready to Deliver"', value: 'stock' },
          { label: '✍️ Something completely different', value: 'other', isOther: true },
        ]
      }
    ]
  },
  {
    id: 'products',
    title: 'Product Catalog Strategy',
    description: 'Optimizing how customers view and find your inventory.',
    questions: [
      {
        id: 'q12',
        type: 'multiple',
        title: 'What mechanisms should customers use to find products?',
        description: 'Example: Do they search by name? Or do they need to see categories like "Waterproofing"?',
        options: [
          { label: '🔍 Search bar', value: 'search' },
          { label: '📂 Browse by category', value: 'category' },
          { label: '🏷️ Browse by brand', value: 'brand' },
          { label: '🎯 Browse by use case', value: 'use_case' },
          { label: '⚡ "Popular Products" section', value: 'popular' },
          { label: '🆕 "New Arrivals" section', value: 'new' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q13',
        type: 'ranking',
        title: 'What information is most essential on the product listing cards?',
        description: 'Rank these items based on what influences a purchase decision the most.',
        options: [
          { label: 'Product photo', value: 'photo' },
          { label: 'Product name', value: 'name' },
          { label: 'Short description', value: 'desc' },
          { label: 'Price or "Get Quote"', value: 'price' },
          { label: '"In Stock" badge', value: 'stock' },
          { label: 'Category tag', value: 'category' },
          { label: 'KEBS Compliant badge', value: 'kebs' },
          { label: '"Order on WhatsApp" button', value: 'whatsapp' },
        ]
      },
      {
        id: 'q14',
        type: 'single',
        title: 'How would you like to handle product pricing?',
        description: 'Example: Displaying "Ksh 1,500" directly vs "Call for Price".',
        required: true,
        options: [
          { label: '💰 Show exact prices for all products', value: 'exact' },
          { label: '💵 Show price ranges', value: 'ranges' },
          { label: '📞 Show "Call for Price" or "Get Quote"', value: 'call' },
          { label: '🔀 Mix: Show prices for some, "Get Quote" for others', value: 'mix' },
          { label: '🤷 Not sure', value: 'unsure' },
        ]
      },
      {
        id: 'q15',
        type: 'single',
        title: 'Is it important to display real-time stock availability?',
        description: 'Example: Showing "Only 3 left in stock" or "Available" vs just listing the product.',
        required: true,
        options: [
          { label: 'Yes - VERY important', value: 'yes_all' },
          { label: 'Yes - but only for featured products', value: 'yes_featured' },
          { label: 'No - we prefer customers to call', value: 'no' },
          { label: 'Not sure', value: 'unsure' },
        ],
        subQuestions: [
           {
            id: 'q15_freq',
            conditionalId: 'q15',
            conditionalValue: ['yes_all', 'yes_featured'],
            type: 'single',
            title: 'How frequently can you update the stock status?',
            description: 'This determines if we need an automated system or a manual update tool.',
            options: [
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'We\'ll need help with this', value: 'help' },
            ]
           }
        ]
      },
      {
        id: 'q16',
        type: 'single',
        title: 'How should we handle Technical Data Sheets (TDS) and MSDS documents?',
        description: 'Example: Should every product page have big "Download PDF" buttons?',
        required: true,
        options: [
          { label: '❌ REMOVE all document downloads', value: 'remove' },
          { label: '📄 Keep documents but make them VERY subtle', value: 'subtle' },
          { label: '📋 Keep documents visible but secondary', value: 'secondary' },
          { label: '📚 Keep documents PROMINENT', value: 'prominent' },
          { label: '🤷 Not sure', value: 'unsure' },
        ]
      },
      {
        id: 'q17',
        type: 'single',
        title: 'What style of product photography do you prefer?',
        description: 'Example: Clean studio shots vs photos taken on a construction site.',
        options: [
          { label: '📸 Professional photos on white background', value: 'pro_white' },
          { label: '🏗️ Photos showing product in use', value: 'in_use' },
          { label: '📦 Photos showing packaging clearly', value: 'packaging' },
          { label: '🔀 Mix of all three styles', value: 'mix' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q18',
        type: 'multiple',
        title: 'What is the primary method for customers to place an order?',
        description: 'Select all methods that apply to your business flow.',
        options: [
          { label: '📝 Fill a "Get A Quote" form', value: 'form' },
          { label: '💬 Click "Order on WhatsApp"', value: 'whatsapp' },
          { label: '📞 Click "Call to Order"', value: 'call' },
          { label: '🛒 Add to cart and checkout online', value: 'ecommerce' },
          { label: '📧 Click "Email Inquiry"', value: 'email' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      }
    ]
  },
  {
    id: 'contact',
    title: 'Communication & Contact',
    description: 'Ensuring customers can reach you effortlessly.',
    questions: [
      {
        id: 'q19',
        type: 'ranking',
        title: 'What is your PREFERRED channel for incoming customer inquiries?',
        description: 'Rank these from your most preferred to least preferred.',
        options: [
          { label: 'WhatsApp message', value: 'whatsapp' },
          { label: 'Phone call', value: 'phone' },
          { label: 'Email', value: 'email' },
          { label: 'Website contact form', value: 'form' },
          { label: 'Visit physical location', value: 'visit' },
        ]
      },
      {
        id: 'q20',
        type: 'single',
        title: 'How prominent should the WhatsApp integration be?',
        description: 'Example: A floating button that follows the user everywhere vs a static link on the contact page.',
        required: true,
        options: [
          { label: '🟢 EVERYWHERE - Floating button + on products', value: 'everywhere' },
          { label: '✓ PROMINENT - Floating + header + footer', value: 'prominent' },
          { label: '📱 VISIBLE - Header and footer', value: 'visible' },
          { label: '💬 MINIMAL - Only on contact page', value: 'minimal' },
          { label: '❌ REMOVE - We prefer phone/email', value: 'remove' },
        ]
      },
      {
        id: 'q21',
        type: 'ranking',
        title: 'Which contact details should be emphasized in the design?',
        description: 'Rank based on what you want customers to see first.',
        options: [
          { label: 'Phone number', value: 'phone' },
          { label: 'WhatsApp number', value: 'whatsapp' },
          { label: 'Physical address', value: 'address' },
          { label: 'Email', value: 'email' },
          { label: 'Business hours', value: 'hours' },
          { label: 'Google Maps', value: 'maps' },
        ]
      },
      {
        id: 'q22',
        type: 'single',
        title: 'How important is it to drive foot traffic to your physical location?',
        description: 'Example: Do you want a big map and directions, or just the address text?',
        required: true,
        options: [
          { label: '🎯 VERY IMPORTANT - Show prominently', value: 'very_important' },
          { label: '✓ IMPORTANT - Show on contact page with map', value: 'important' },
          { label: '📍 MODERATE - Just show address text', value: 'moderate' },
          { label: '📦 LOW - De-emphasize', value: 'low' },
        ]
      },
      {
        id: 'q23',
        type: 'single',
        title: 'Should we include a "Get Directions" feature linked to Google Maps?',
        description: 'Example: A button that opens the route on the customer\'s phone.',
        options: [
          { label: 'Yes - very helpful', value: 'yes' },
          { label: 'Yes - on contact page only', value: 'yes_contact' },
          { label: 'No', value: 'no' },
        ]
      }
    ]
  },
  {
    id: 'design',
    title: 'Design & Visual Identity',
    description: 'Establishing the look and feel of your digital presence.',
    questions: [
      {
        id: 'q24',
        type: 'single',
        title: 'What is your preference for the color palette?',
        description: 'Standard corporate colors are Steel Blue, Charcoal, Fosroc Red, and White.',
        required: true,
        options: [
          { label: '✅ Use ALL these colors', value: 'all' },
          { label: '🔵 Emphasize Steel Blue', value: 'blue' },
          { label: '🔴 Emphasize Fosroc Red', value: 'red' },
          { label: '🎨 Different colors entirely', value: 'other', isOther: true },
          { label: '🤷 Trust your design judgment', value: 'trust' },
        ]
      },
      {
        id: 'q25',
        type: 'single',
        title: 'What overall style best represents your business?',
        description: 'Example: "Industrial" implies ruggedness and reliability, while "Modern" implies sleekness.',
        options: [
          { label: '🏢 Modern & Professional', value: 'modern' },
          { label: '⚡ Bold & Vibrant', value: 'bold' },
          { label: '🏗️ Industrial & Technical', value: 'industrial' },
          { label: '🛍️ E-commerce Store', value: 'ecommerce' },
          { label: '🤷 Not sure', value: 'unsure' },
        ]
      },
      {
        id: 'q26',
        type: 'single',
        title: 'What is your preferred style for imagery and photography?',
        description: 'Example: Do you want polished stock photos or raw images from the field?',
        options: [
          { label: '📸 Professional photoshoot', value: 'pro' },
          { label: '📱 Authentic/candid', value: 'authentic' },
          { label: '🎨 Mix of both', value: 'mix' },
          { label: '🖼️ Minimal photos', value: 'minimal' },
        ]
      },
      {
        id: 'q27',
        type: 'single',
        title: 'How do you prioritize the mobile experience vs desktop?',
        description: 'Example: If most of your clients are on site, mobile is critical.',
        required: true,
        options: [
          { label: '📱 CRITICAL - Mobile is MORE important', value: 'critical' },
          { label: '⚖️ EQUAL - Equal importance', value: 'equal' },
          { label: '💻 DESKTOP FIRST', value: 'desktop' },
        ]
      }
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-commerce & Online Ordering',
    description: 'Defining the scope of online transactions.',
    questions: [
      {
        id: 'q28',
        type: 'single',
        title: 'What is your vision for E-commerce functionality?',
        description: 'Example: Do you want a full online store now, or just a catalog for inquiry?',
        required: true,
        options: [
          { label: '🛒 FULL E-COMMERCE NOW', value: 'full' },
          { label: '🎯 PHASE 2 (Launch basic first)', value: 'phase2' },
          { label: '📞 HYBRID (Cart -> Call)', value: 'hybrid' },
          { label: '❌ NOT NOW (Quote/Inquiry only)', value: 'none' },
          { label: '🤷 NOT SURE', value: 'unsure' },
        ]
      },
      {
        id: 'q29',
        conditionalId: 'q28',
        conditionalValue: ['full', 'phase2', 'hybrid', 'unsure'],
        type: 'multiple',
        title: 'Which payment methods would you like to accept?',
        description: 'Select all that apply for your future store.',
        options: [
          { label: '💳 Credit/Debit Cards', value: 'cards' },
          { label: '📱 M-Pesa', value: 'mpesa' },
          { label: '🏦 Bank Transfer', value: 'bank' },
          { label: '🚚 Pay on Delivery', value: 'cod' },
          { label: '📄 Credit Account', value: 'credit' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q30',
        conditionalId: 'q28',
        conditionalValue: ['full', 'phase2', 'hybrid', 'unsure'],
        type: 'multiple',
        title: 'Which specific e-commerce features are essential for your business?',
        description: 'Example: Do you need bulk discounts for contractors?',
        options: [
          { label: '🛒 Shopping cart', value: 'cart' },
          { label: '✅ Real-time stock', value: 'stock' },
          { label: '📦 Auto delivery cost', value: 'shipping' },
          { label: '📍 Order tracking', value: 'tracking' },
          { label: '👤 Customer accounts', value: 'accounts' },
          { label: '⚡ One-click reorder', value: 'reorder' },
          { label: '💰 Bulk discounts', value: 'discounts' },
          { label: '❤️ Wishlist', value: 'wishlist' },
        ]
      },
      {
        id: 'q31',
        type: 'multiple',
        title: 'How will product delivery be handled?',
        description: 'This affects how we calculate shipping costs in the system.',
        options: [
          { label: '🚚 We deliver (own vehicles)', value: 'own' },
          { label: '🤝 Third-party delivery', value: 'third_party' },
          { label: '🏢 Customers collect', value: 'collect' },
          { label: 'Other', value: 'other', isOther: true },
        ]
      },
      {
        id: 'q32',
        type: 'single',
        title: 'Is there a minimum order value or quantity?',
        description: 'Example: "We only deliver orders above Ksh 5,000."',
        options: [
          { label: 'Yes (Specify amount)', value: 'yes', isOther: true },
          { label: 'Yes - depends on location', value: 'depends' },
          { label: 'No', value: 'no' },
        ]
      },
      {
        id: 'q33',
        type: 'single',
        title: 'How should customers be able to track their orders?',
        description: 'Example: Fully automated system vs calling the office.',
        options: [
          { label: '✅ Track in real-time', value: 'realtime' },
          { label: '✅ Get SMS updates', value: 'sms' },
          { label: '📧 Email updates only', value: 'email' },
          { label: '📞 Call us for updates', value: 'manual' },
        ]
      }
    ]
  },
  {
    id: 'content',
    title: 'Content Strategy & Management',
    description: 'Planning for the maintenance and growth of the website.',
    questions: [
      {
        id: 'q34',
        type: 'single',
        title: 'How frequently do you anticipate updating content on the site?',
        description: 'Example: Adding new products or changing prices.',
        required: true,
        options: [
          { label: '📅 DAILY', value: 'daily' },
          { label: '📆 WEEKLY', value: 'weekly' },
          { label: '📊 MONTHLY', value: 'monthly' },
          { label: '🔄 QUARTERLY', value: 'quarterly' },
        ]
      },
      {
        id: 'q35',
        type: 'single',
        title: 'Who will be responsible for updating the website?',
        description: 'This determines how user-friendly the dashboard needs to be.',
        required: true,
        options: [
          { label: '👥 Our team', value: 'internal' },
          { label: '🤝 Shared', value: 'shared' },
          { label: '💻 Developer', value: 'developer' },
          { label: '🤷 Not decided', value: 'undecided' },
        ]
      },
      {
        id: 'q36',
        type: 'single',
        title: 'How important is the ease of updating the website to you?',
        description: 'Example: Do you need a drag-and-drop builder or are you comfortable with forms?',
        required: true,
        options: [
          { label: '😊 VERY EASY', value: 'easy' },
          { label: '✓ MODERATELY EASY', value: 'moderate' },
          { label: '💻 TECHNICAL', value: 'technical' },
          { label: '🤷 Doesn\'t matter', value: 'any' },
        ]
      },
      {
        id: 'q37',
        type: 'single',
        title: 'Do you want a Blog or News section?',
        description: 'Example: To share industry news, project updates, or tips.',
        required: true,
        options: [
          { label: '✍️ YES - Regularly', value: 'regular' },
          { label: '✓ YES - Occasionally', value: 'occasional' },
          { label: '⏰ LATER', value: 'later' },
          { label: '❌ NO', value: 'no' },
        ]
      }
    ]
  },
  {
    id: 'final',
    title: 'Final Thoughts & Requirements',
    description: 'Wrap up with any remaining details.',
    questions: [
      {
        id: 'q38',
        type: 'textarea',
        title: 'Are there any competitor or industry websites you admire?',
        description: 'Please paste URLs and mention what you like about them (e.g. "I like the menu on example.com").',
        placeholder: 'Paste URLs and what you like about them here...'
      },
      {
        id: 'q39',
        type: 'textarea',
        title: 'What specific outcome would make this redesign a SUCCESS for you?',
        description: 'Example: "If we get 5 quote requests a week," or "If customers stop calling to ask for directions."',
        required: true,
        placeholder: 'e.g., More quote requests, better Google ranking...'
      },
      {
        id: 'q40',
        type: 'textarea',
        title: 'Is there anything else we should know about this project?',
        description: 'Example: Budget constraints, specific timeline deadlines, or special features not mentioned.',
        placeholder: 'Budget, timeline, special features...'
      }
    ]
  }
];