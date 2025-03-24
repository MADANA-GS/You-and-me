import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import Heart from "../components/Hearts";
import MessagePopup from "../components/MessagePopup";
import { AnimatePresence, motion } from "framer-motion";
import ShinyText from "../components/ShinyText";
const romanticMessages = [
  { text: "You're the melody to my heart 💖🎶", image: "/images/heart1.png" },
  {
    text: "Every beat of this song whispers your name 💘",
    image: "/images/heart2.png",
  },
  {
    text: "You're the missing lyrics to my love song 💞",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing to the rhythm of our love 💃🕺",
    image: "/images/heart4.png",
  },
  { text: "Your love is my favorite song 🎵💕", image: "/images/heart5.png" },
  {
    text: "Our hearts beat in perfect harmony 💓",
    image: "/images/heart1.png",
  },
  {
    text: "You're the chorus I can't get out of my head 🎧❤️",
    image: "/images/heart2.png",
  },
  {
    text: "Let's compose a lifetime of memories together 📝💖",
    image: "/images/heart3.png",
  },
  {
    text: "My heart sings whenever you're near 🎤💞",
    image: "/images/heart4.png",
  },
  {
    text: "You make my heart dance to love's rhythm 💃❤️",
    image: "/images/heart5.png",
  },
  {
    text: "Together we create the sweetest symphony 🎵💘",
    image: "/images/heart1.png",
  },
  {
    text: "You struck the perfect chord in my heart 🎸💕",
    image: "/images/heart2.png",
  },
  { text: "My love for you plays on repeat 🔄❤️", image: "/images/heart3.png" },
  {
    text: "You're the music that calms my soul 🎶💓",
    image: "/images/heart4.png",
  },
  {
    text: "Our love story deserves its own soundtrack 🎼💞",
    image: "/images/heart5.png",
  },
  {
    text: "You orchestrate the melody of my dreams 💭💖",
    image: "/images/heart1.png",
  },
  {
    text: "With you, every moment feels like a love song 🎵❤️",
    image: "/images/heart2.png",
  },
  {
    text: "You're the rhythm my heart follows 💓🎶",
    image: "/images/heart3.png",
  },
  {
    text: "Let's dance to our love's sweet tune forever 💃💕",
    image: "/images/heart4.png",
  },
  {
    text: "You're the perfect note in my life's composition 🎼💘",
    image: "/images/heart5.png",
  },
  {
    text: "My heart beats in time with yours 💗🎵",
    image: "/images/heart1.png",
  },
  {
    text: "You're the soundtrack to my happiest moments ❤️🎧",
    image: "/images/heart2.png",
  },
  {
    text: "Our love creates the most beautiful harmony 🎶💞",
    image: "/images/heart3.png",
  },
  { text: "You're my heart's favorite tune 💓🎵", image: "/images/heart4.png" },
  {
    text: "Together we compose a masterpiece of love 🎼💖",
    image: "/images/heart5.png",
  },
  { text: "Your voice is music to my ears 🎤💘", image: "/images/heart1.png" },
  { text: "Our hearts share the same tempo 💓🎶", image: "/images/heart2.png" },
  {
    text: "You brought rhythm to my once silent heart ❤️🎵",
    image: "/images/heart3.png",
  },
  {
    text: "I'd dance with you through every season 💃💕",
    image: "/images/heart4.png",
  },
  {
    text: "You're the love song I never knew I needed 🎵💞",
    image: "/images/heart5.png",
  },
  {
    text: "With you, I found my heart's melody 💖🎶",
    image: "/images/heart1.png",
  },
  {
    text: "You compose the soundtrack of my happiness 🎼❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My love for you plays like an endless symphony 🎵💓",
    image: "/images/heart3.png",
  },
  {
    text: "You're the perfect harmony to my melody 🎶💞",
    image: "/images/heart4.png",
  },
  {
    text: "Let's waltz through life together forever 💃💕",
    image: "/images/heart5.png",
  },
  {
    text: "You fill my silence with beautiful music 🎵❤️",
    image: "/images/heart1.png",
  },
  {
    text: "My heart composes poems when you're near 📝💖",
    image: "/images/heart2.png",
  },
  {
    text: "You're the melodious whisper in my dreams 🎶💓",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing with you is like floating on clouds ☁️💞",
    image: "/images/heart4.png",
  },
  {
    text: "You sparked a concert of love in my heart 🎤💘",
    image: "/images/heart5.png",
  },
  {
    text: "Our heartbeats create perfect stereo sound 🔊❤️",
    image: "/images/heart1.png",
  },
  {
    text: "You're the musical note that makes my heart skip 💞🎵",
    image: "/images/heart2.png",
  },
  {
    text: "I'd serenade you with my love forever 🎸💖",
    image: "/images/heart3.png",
  },
  {
    text: "We're dancing to a lifetime of beautiful moments 💃💕",
    image: "/images/heart4.png",
  },
  {
    text: "You're the rhythm that makes my world complete 🌍💓",
    image: "/images/heart5.png",
  },
  {
    text: "My heart plays a love song only you can hear 💖🎵",
    image: "/images/heart1.png",
  },
  {
    text: "You conduct the orchestra of my emotions 🎼❤️",
    image: "/images/heart2.png",
  },
  {
    text: "Our love resonates like a perfect harmony 🎶💞",
    image: "/images/heart3.png",
  },
  {
    text: "You make my heart dance with joy 💃💓",
    image: "/images/heart4.png",
  },
  {
    text: "Together we're writing our love's greatest hit 🎵💘",
    image: "/images/heart5.png",
  },
  {
    text: "You're the sweetest melody I've ever known 🎶❤️",
    image: "/images/heart1.png",
  },
  {
    text: "My heart performs a symphony just for you 🎼💖",
    image: "/images/heart2.png",
  },
  {
    text: "You're the muse behind my heart's song 💓🎵",
    image: "/images/heart3.png",
  },
  {
    text: "Let's dance cheek to cheek for eternity 💃💞",
    image: "/images/heart4.png",
  },
  {
    text: "You're the musical inspiration for my soul 🎵💘",
    image: "/images/heart5.png",
  },
  {
    text: "Our love plays like a never-ending playlist 🎧❤️",
    image: "/images/heart1.png",
  },
  {
    text: "You're the lullaby that soothes my heart 🎶💓",
    image: "/images/heart2.png",
  },
  {
    text: "My heart composes sonnets for you daily 📝💖",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing through life with you is divine 💃💕",
    image: "/images/heart4.png",
  },
  {
    text: "You're the beautiful ballad of my existence 🎵💘",
    image: "/images/heart5.png",
  },
  {
    text: "Our love creates a symphony of dreams 💭💖",
    image: "/images/heart1.png",
  },
  {
    text: "You're the crescendo in my heart's melody 🎶❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My soul sings whenever you're around 🎤💞",
    image: "/images/heart3.png",
  },
  {
    text: "You make every moment feel like a perfect dance 💃💓",
    image: "/images/heart4.png",
  },
  {
    text: "You're the tune that never leaves my heart 🎵💕",
    image: "/images/heart5.png",
  },
  {
    text: "Together we've found our perfect rhythm 🎶💘",
    image: "/images/heart1.png",
  },
  {
    text: "You're the enchanting melody of my days 🎵❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My heart performs a solo just for you 💓🎤",
    image: "/images/heart3.png",
  },
  {
    text: "Let's tango through a lifetime of love 💃💖",
    image: "/images/heart4.png",
  },
  {
    text: "You're the sweetest song my heart has ever known 🎵💞",
    image: "/images/heart5.png",
  },
  {
    text: "Our love resonates like the most beautiful music 🎶💘",
    image: "/images/heart1.png",
  },
  {
    text: "You turned my heartbeat into a love song ❤️🎵",
    image: "/images/heart2.png",
  },
  {
    text: "My heart composes melodies inspired by you 🎼💖",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing with you makes my spirit soar 💃💓",
    image: "/images/heart4.png",
  },
  {
    text: "You're the gentle rhythm that calms my soul 🎵💕",
    image: "/images/heart5.png",
  },
  {
    text: "Together we create a concerto of love 🎻💘",
    image: "/images/heart1.png",
  },
  {
    text: "You're the music that fills my silent moments 🎶❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My heart sings anthems of adoration for you 🎤💞",
    image: "/images/heart3.png",
  },
  {
    text: "Let's waltz under the stars forever 💃✨",
    image: "/images/heart4.png",
  },
  {
    text: "You've conducted a beautiful melody in my life 🎵💖",
    image: "/images/heart5.png",
  },
  {
    text: "Our hearts beat to the same beautiful song 💓🎶",
    image: "/images/heart1.png",
  },
  {
    text: "You're the love ballad I want to hear forever 🎵❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My heart strums a love song just for you 🎸💞",
    image: "/images/heart3.png",
  },
  {
    text: "Each day with you feels like dancing on clouds ☁️💃",
    image: "/images/heart4.png",
  },
  {
    text: "You're the melodious whisper of my dreams 🎵💘",
    image: "/images/heart5.png",
  },
  {
    text: "Together we've found our perfect harmony 🎶💖",
    image: "/images/heart1.png",
  },
  {
    text: "You're the sweet serenade that fills my nights 🌙❤️",
    image: "/images/heart2.png",
  },
  {
    text: "My heart beats in rhythm with your love 💓🎵",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing through life with you is magical ✨💃",
    image: "/images/heart4.png",
  },
  {
    text: "You're the musical note that completes my heart 🎵💕",
    image: "/images/heart5.png",
  },
  {
    text: "Our love creates the most beautiful symphony 🎶💘",
    image: "/images/heart1.png",
  },
  {
    text: "You're the heartfelt lyrics to my soul's song ❤️🎵",
    image: "/images/heart2.png",
  },
  {
    text: "My heart plays a melody inspired by you 🎼💞",
    image: "/images/heart3.png",
  },
  {
    text: "Let's dance to our love song for eternity 💃💖",
    image: "/images/heart4.png",
  },
  {
    text: "You're the rhythm that makes my heart whole 🎵💓",
    image: "/images/heart5.png",
  },
  {
    text: "Together we orchestrate a beautiful love story 🎶💘",
    image: "/images/heart1.png",
  },
  {
    text: "You're the melody that never fades from my heart ❤️🎵",
    image: "/images/heart2.png",
  },
  {
    text: "My heart composes a new love note each day 📝💞",
    image: "/images/heart3.png",
  },
  {
    text: "Dancing with you is my heart's greatest joy 💃💓",
    image: "/images/heart4.png",
  },
  {
    text: "You're the beautiful soundtrack of my life 🎵💕",
    image: "/images/heart5.png",
  },
];
const songs = [
  {
    name: "Ninna Gungalle",
    url: "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1742022588/ADHVIK_-_NINNA_GUNGALLI_Official_Music_Video_pdxi3w.mp3",
  },
  {
    name: "Kaanthaa",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742751979/Kaanthaa_-_Masala_Coffee_-_Music_Mojo_Season_3_-_Kappa_TV___Black_Memories-yt.savetube.me_bpor1k.mp3",
  },
  {
    name: "Aadiyilalo",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742752465/Aadiyilalo_Anthamilalo___Masala_Coffee-yt.savetube.me_yglo8a.mp3",
  },
  {
    name: "Mayavi",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742752473/Mayavi_%E0%B2%AE%E0%B2%BE%E0%B2%AF%E0%B2%BE%E0%B2%B5%E0%B2%BF___Sonu_Nigam___Sanjith_Hegde___Nagarjun_Sharma___Bhoomi_2024___Merchant_Records-yt.savetube.me_mf9hau.mp3",
  },
  {
    name: "Jo Tum",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742752464/Anuv_Jain_-_JO_TUM_MERE_HO_Official_Video_-yt.savetube.me_ufg5cf.mp3",
  },
  {
    name: "Eredu jedeyanu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754177/Eradu_Jadeyannu_Video_Song___Jackie___Puneeth_Rajkumar___Bhavana_Menon___V._Harikrishna__-yt.savetube.me_k4uq3m.mp3",
  },
  {
    name: "Nange allava",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754145/Sanjith_Hegde_-_Nange_Allava___Official_Music_Video-yt.savetube.me_qhluud.mp3",
  },
  {
    name: "One Love",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754165/Shubh_-_One_Love_Official_Audio_-yt.savetube.me_yh9z0n.mp3",
  },
  {
    name: "Aasa Kooda",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754797/Sai_Abhyankkar_-_Aasa_Kooda_Music_Video___Thejo_Bharathwaj___Preity_Mukundhan___Sai_Smriti-yt.savetube.me_enhyil.mp3",
  },
  {
    name: "Nadaaniyan",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754791/Akshath_-_Nadaaniyan_Lyrics_-yt.savetube.me_w2ox48.mp3",
  },
  {
    name: "Sajni",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754789/Sajni_Song___Arijit_Singh_Ram_Sampath___Laapataa_Ladies___Aamir_Khan_Productions-yt.savetube.me_dis77y.mp3",
  },
  {
    name: "Yeh Tune Kya Kiya",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742754789/Yeh_Tune_Kya_Kiya_Song_Once_upon_A_Time_In_Mumbaai_Dobara___Pritam___Akshay_Kumar_Sonakshi_Sinha-yt.savetube.me_ndo1rc.mp3",
  },
  {
    name: "Gatiya Ilidu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756554/Ulidavaru_Kandante___Gatiya_Ilidu___Video_Song___Vijay_Prakash___Rakshit_Shetty___Kishore___Ajaneesh-yt.savetube.me_gxsoqu.mp3",
  },
  {
    name: "Kaagadada Doniyalli",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756525/Kaagadada_Doniyalli_-_Video_Song___Kirik_Party___Rakshit_Shetty___Jayanth_Kaikini___Ajaneesh_Loknath-yt.savetube.me_omkxlv.mp3",
  },
  {
    name: "Munjaane Manjalli",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756524/MUNJAANE_MANJALLI___Raghu_Dixit___55th_Bengaluru_Ganesh_Utsava_2017-yt.savetube.me_clbfgz.mp3",
  },
  {
    name: "Marali Manasaagide",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756523/Gentleman___Marali_Manasaagide___4K_Video_Song___Prajwal___Nishvika___Jadesh_Kumar__Ajaneesh_Loknath-yt.savetube.me_whge4e.mp3",
  },
  {
    name: "Chaleya",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756521/JAWAN__Chaleya_Hindi___Shah_Rukh_Khan___Nayanthara___Atlee___Anirudh___Arijit_S_Shilpa_R___Kumaar-yt.savetube.me_ewdfsr.mp3",
  },
  {
    name: "Run It Up",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756520/Hanumankind_-_Run_It_Up_Prod._By_Kalmi___Official_Music_Video_-yt.savetube.me_gkotl7.mp3",
  },
  {
    name: "Dwapara",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756516/Dwapara_Lyrical___Krishnam_Pranaya_Sakhi___Golden_Ganesh___Malvika_Nair_Arjun_Janya_Jaskaran__Dr.VNP-yt.savetube.me_cqjvnu.mp3",
  },
  {
    name: "Nanage Neenu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756508/Nanage_Neenu_Video_Song___Chikkanna___Malaika___Smitha_Umapathy___Arjun_Janya_Anil_Kumar_Upadhyaksha-yt.savetube.me_ienmu1.mp3",
  },
  {
    name: "Neenu Nannavale",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756504/Neenu_Nannavale___Chandan_Shetty___Niveditha_Gowda___Raja_Rani-yt.savetube.me_vdzkd0.mp3",
  },
  {
    name: "Soul Of Dia",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756503/DIA_-_Soul_Of_Dia_Video_Song___Sanjith_Hegde_Chinmayi_Sripaada___B._Ajaneesh_Loknath___KS_Ashoka-yt.savetube.me_syuep4.mp3",
  },
  {
    name: "Jagave Neenu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756503/LOVE_360___Jagave_Neenu_I_Music_Video___Sid_Sriram___Praveen___Rachana_Inder___Arjun_Janya__Shashank-yt.savetube.me_b7m2cf.mp3",
  },
  {
    name: "Vazhithunaiye",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756499/Vazhithunaiye_Video_Song___Dragon___Pradeep_Ranganathan_Kayadu___Ashwath_Marimuthu___Leon_James-yt.savetube.me_rfzdvp.mp3",
  },
  {
    name: "Sapta Sagaradaache Ello",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756497/Sapta_Sagaradaache_Ello_-_Title_Track___Rakshit_Shetty___Rukmini___Hemanth_M_Rao__Charan_Raj___Kapil-yt.savetube.me_jjvd6w.mp3",
  },
  {
    name: "Yenendu Hesaridali",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756493/Yenendu_Hesaridali___Slowed_Reverb___Lofi_graduate-yt.savetube.me_whsqon.mp3",
  },
  {
    name: "Parasiva Kande",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742756485/Parasiva_Kande_Parasivana___Raghu_Dixit___Courtyard_Jam_Sessions___2019-yt.savetube.me_emj5ry.mp3",
  },
  {
    name: "Beauty Benkaiti",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758156/%E0%B2%AC%E0%B3%8D%E0%B2%AF%E0%B3%82%E0%B2%9F%E0%B2%BF_%E0%B2%AC%E0%B3%86%E0%B2%82%E0%B2%95%E0%B3%88%E0%B2%A4%E0%B2%BF_%E0%B2%B2%E0%B2%BF%E0%B2%B0%E0%B2%BF%E0%B2%95%E0%B3%8D%E0%B2%B8%E0%B3%8D_%E0%B2%95%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%A1%E0%B2%A6%E0%B2%B2%E0%B3%8D%E0%B2%B2%E0%B2%BF__beauty_benkaiti___uttarakarnataka_song__-yt.savetube.me_fdavmf.mp3",
  },
  {
    name: "Hrudayake Hedarike",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758155/Hrudayake_Hedarike_Chythra_Bharath_PREWEDDING_CHIKKAMANGALORE-yt.savetube.me_wsmre8.mp3",
  },
  {
    name: "Ishq Hai",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758156/Ishq_Hai_Official_Music_Video___Mismatched_Season_3___A_Netflix_Series___Anurag_Saikia-yt.savetube.me_ekcq3s.mp3",
  },
  {
    name: "Kadalanu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758160/Kadalanu_-_Video_Song___Sapta_Sagaradaache_Ello___Rakshit_Shetty___Rukmini___Charanraj___Hemanth_Rao-yt.savetube.me_mhoncy.mp3",
  },
  {
    name: "Parichayavade",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758161/Bagheera___Parichayavade_%EF%B8%8F___Sriimurali_Rukmini___Ajaneesh___Dr.Suri___PrasanthNeel___HombaleFilms-yt.savetube.me_hgtfv7.mp3",
  },
  {
    name: "Paravashanadenu",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758164/Paravashanadenu_Lyric_Video___Paramathma___Sonu_Nigam___Puneet_Rajkumar_Deepa_Sannidhi-yt.savetube.me_x6ajoj.mp3",
  },
  {
    name: "Nee Parichaya",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758164/Ninna_Sanihake_-_Nee_Parichaya_Video_Song___Suraj_Gowda___Dhanya_Ramkumar_Raghu_Dixit_Vasuki_Vaibhav-yt.savetube.me_pilw5w.mp3",
  },
  {
    name: "Tajaa Samachara",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758169/Natasaarvabhowma_Video_Songs__Tajaa_Samachara_Full_Video_Song___Puneeth_Rajkumar_Anupama___D_Imman-yt.savetube.me_r1w7hy.mp3",
  },
  {
    name: "Aane Maadi Heluteeni",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758169/Guru_Shishyaru___Aane_Maadi_Heluteeni___Sharaan__Nishvika_Tharun__B.Ajneesh_Loknath_Jadeshaa_K_Hampi-yt.savetube.me_xeuogo.mp3",
  },
  {
    name: "Kavithe Kavithe",
    url: "https://res.cloudinary.com/dhvxzjkki/video/upload/v1742758171/Kavithe_Kavithe_Lyrical_Yuva_Yuva_Rajkumar_Sapthami_Santhosh_Hombale_Films_Ajaneesh_Vijay_Kiragandur-yt.savetube.me_eoy9h6.mp3",
  },
];

const HeartMessage = () => {
  const [playing, setPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(
    Math.floor(Math.random() * songs.length)
  );
  const [message, setMessage] = useState(null);
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);

  // Initialize audio only once
  useEffect(() => {
    audioRef.current = new Audio();

    // Add comprehensive event handlers
    audioRef.current.addEventListener("canplaythrough", () => {
      setIsLoading(false);
      if (playing) {
        playAudio();
      }
    });

    audioRef.current.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      // Try next song on error
      nextSong();
    });

    audioRef.current.addEventListener("ended", nextSong);

    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeEventListener("canplaythrough", () => {});
        audio.removeEventListener("error", () => {});
        audio.removeEventListener("ended", nextSong);
      }
    };
  }, []);

  // Load audio source when currentSongIndex changes
  useEffect(() => {
    const loadSong = async () => {
      if (!audioRef.current) return;

      try {
        setIsLoading(true);
        audioRef.current.pause();
        audioRef.current.src = songs[currentSongIndex].url;
        audioRef.current.load();

        // If it was already playing, try to play the new song
        if (playing) {
          playAudio();
        }
      } catch (error) {
        console.error("Error loading song:", error);
        setIsLoading(false);
      }
    };

    loadSong();
  }, [currentSongIndex]);

  const playAudio = async () => {
    try {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(true);
            })
            .catch((error) => {
              console.error("Play error:", error);
              // Auto-recovery: try again after a short delay
              setTimeout(() => {
                if (playing) playAudio();
              }, 500);
            });
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const togglePlayPause = useCallback(
    (e) => {
      if (e) e.stopPropagation();

      if (!playing) {
        playAudio();
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          setPlaying(false);
        }
      }
    },
    [playing]
  );

  const nextSong = useCallback(() => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  }, []);

  const prevSong = useCallback(() => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) =>
        prev.length >= 30 ? prev.slice(1) : [...prev, Date.now()]
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleHeartClick = (event) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const randomMessage =
      romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    setMessage({ text: randomMessage.text, image: randomMessage.image });
    setMessagePosition({ x: clientX, y: clientY });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div
      className="fixed no-scrollbar inset-0 bg-black flex items-center justify-center overflow-x-hidden overflow-y-auto mt-20"
      onClick={() => !playing && togglePlayPause()}
    >
      <div className="min-h-[100dvh] w-full flex items-center justify-center">
        <nav className="fixed z-50 top-20 sm:w-[400px] md:w-[600px] w-80 min-h-14 rounded-full bg-black backdrop-blur-md flex items-center justify-between px-7 py-2 shadow-[0px_0px_10px_3px_rgba(255,0,79,0.5)]">
          <button className="text-[#ff004f] w-2/3 mt-1 text-lg text-start font-semibold flex items-center gap-2">
            <h1 className={`${playing ? "text-green-600" : "text-white/60"}`}>
              {isLoading ? "Loading..." : songs[currentSongIndex].name}
            </h1>
          </button>
          <div className="flex items-center gap-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSong();
              }}
              className="text-[#b5b5b5a4] hover:text-[#ff004f]"
            >
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlayPause}
              className="text-[#b5b5b5a4] hover:text-[#ff004f]"
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSong();
              }}
              className="text-[#b5b5b5a4] hover:text-[#ff004f]"
            >
              <FaStepForward />
            </button>
          </div>
        </nav>

        {playing ? (
          hearts.map((id) => (
            <motion.div
              key={id}
              whileHover={{ scale: 1.2 }}
              onClick={handleHeartClick}
            >
              <Heart id={id} />
            </motion.div>
          ))
        ) : (
          <h1 className="w-72 text-white text-2xl text-center animate-pulse opacity-80">
            Click and Play my melody, kiss softly.
          </h1>
        )}

        <AnimatePresence>
          {message && (
            <MessagePopup
              text={message.text}
              image={message.image}
              x={messagePosition.x}
              y={messagePosition.y}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeartMessage;
