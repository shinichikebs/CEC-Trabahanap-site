<?php

namespace Database\Seeders;

use App\Models\JobOffer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $jobOfferData = [
            [
                'job_title' => 'React Component Development Task',
                'job_description' => 'I am looking for a skilled ReactJS developer to optimize my existing website for mobile devices and enhance its visual appeal. The website is already built, but it requires styling adjustments to ensure it looks good and functions well on mobile devices.
                                Key Responsibilities:
                                Optimize the website for mobile responsiveness.
                                Adjust and align elements to improve visual appeal.
                                Add and integrate images where necessary.
                                Ensure consistency in design and layout across different devices and screen sizes.
                                Fix any minor styling issues to enhance the overall user experience.

                                Requirements:
                                Proficiency in ReactJS and CSS.
                                Experience in mobile optimization and responsive design.
                                Strong attention to detail and a good eye for design.',
                'category' => 'Programming',
                'user_id' => 1,
                'sub_category' => 'HelloWoorld',
                'Working_type' => 'Full Time',
            ],
            [
                'job_title' => 'Html Website Development',
                'job_description' => 'Hi,
                                I need this website done asap, it will be on HTML and you have to make it all device responsive too like for mobile, tablet and other devices too, And we have to add transition loading animations too so it will looks good, I need your best here.
                                I have attached the website Design, Thanks',
                'category' => 'Web Development',
                'user_id' => 2,
                'sub_category' => 'Submarine',
                'Working_type' => 'Part Time',
            ],
            [
                'job_title' => 'Find someone to work on a simple image enhancement for coloring book',
                'job_description' => "Dear potential freelancers,
                                We're looking for a skilled image editor to join our team for an exciting coloring book project. This is a fantastic opportunity for someone who enjoys detailed work and is looking for a long-term collaboration. Here's what you need to know:
                                Project Details:

                                Task: Remove unnecessary noise/shades from AI-generated images to create simple black lined coloring pages.
                                Purpose: Creating clean images for coloring books
                                Complexity: Very simple image editing work
                                Volume: 30-40 images per project
                                Frequency: At least 1-2 projects per week
                                Pay: $5 per project (30-40 images)

                                What we're looking for:

                                Skills in image editing software
                                Attention to detail
                                Ability to follow provided samples closely
                                Excellent communication skills
                                Reliability and consistency in work quality
                                Understanding and acceptance of the project terms

                                Please note:

                                While the work is simple, it requires precision and care.
                                We understand the pay rate might seem low, but the work is straightforward and quick for those with the right skills.
                                This is an ongoing project with potential for increased work and additional opportunities for those who consistently deliver high-quality results.

                                Payment Terms:

                                Payments will be made weekly based on the number of completed projects.
                                Please only apply if you fully understand and accept these terms.

                                How to Apply:

                                Review the sample images we've created to understand the work involved.
                                Provide a sample of your work demonstrating your ability to perform this type of image editing.
                                Briefly explain why you're interested in this project and how your skills match our needs.

                                We're excited to find a dedicated freelancer who can grow with us on this project. If you believe you're the right fit and are interested in a long-term collaboration, we'd love to hear from you!
                                Looking forward to working together to create beautiful coloring books!",
                'category' => 'Graphic Arts',
                'user_id' => 3,
                'sub_category' => 'OniChan',
                'Working_type' => 'Full Time',
            ],
        ];

        foreach ($jobOfferData as $job) {
            JobOffer::insert([
                ...$job,
                'created_at' => now(),
            ]);
        }
    }
}