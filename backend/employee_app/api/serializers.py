from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenRefreshSerializer


from rest_framework import serializers
from employee_app.models import User,UserProfile
from rest_framework_simplejwt.tokens import RefreshToken, Token,AccessToken


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        # ...
        
        return token
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields= '__all__'


class UserSerializer(serializers.ModelSerializer):
    User_Profile = UserProfileSerializer() 
    class Meta:
        model = User
        exclude = ('password',)


class UserDetailsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_pic']
    

class UserRegisterSerializer(serializers.ModelSerializer):
    designation = serializers.CharField(source='User_Profile.designation', allow_blank=True)
    experience = serializers.IntegerField(source='User_Profile.experience', allow_null=True)
    salary = serializers.IntegerField(source='User_Profile.salary', allow_null=True)
    qualification = serializers.CharField(source='User_Profile.qualification', allow_null=True)

    class Meta:
        model = User
        fields = ['id','first_name','phone_number','email','password','designation', 'experience', 'salary', 'qualification']
        extra_kwargs = {
            'password':{ 'write_only':True}
        }
        

    def create(self, validated_data):
        profile_data = validated_data.pop('User_Profile', {})
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        UserProfile.objects.create(user=user, **profile_data)

        return user
       
###################### ADMIN SIDE ####################

class UserProfileAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_pic', 'designation', 'experience', 'salary', 'qualification']
        
class AdminUserSerializer(serializers.ModelSerializer):
    User_Profile = UserProfileAdminSerializer(required=False)

    class Meta:
        model = User    
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'User_Profile','password','is_active']
        extra_kwargs = {
            'password':{ 'write_only':True},
            'first_name': {'error_messages': {'required': 'Please provide the first name.'}},
            'last_name': {'error_messages': {'required': 'Please provide the last name.'}},
            'phone_number': {'error_messages': {'required': 'Please provide the phone number.'}},
            'email': {'error_messages': {'required': 'Please provide the email address.'}} 
            
        }
    
    
    def create(self, validated_data):
       
        profile_data = validated_data.pop('User_Profile',{}  )
        password = validated_data.pop('password',None)
        print("-=-=-=-=-=")
        print(password)
        user_instance = self.Meta.model(**validated_data)
        if password is not None:
            user_instance.set_password(password)
            user_instance.is_active=True
            user_instance.save()
            
        UserProfile.objects.create(user=user_instance, **profile_data)
        return user_instance
    
class UserUpdateSerializer(serializers.ModelSerializer):
    User_Profile=UserProfileAdminSerializer(required=False)
    class Meta:
        model = User
        fields = ['first_name', 'phone_number', 'email', 'is_active','User_Profile']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()

        profile_data = validated_data.get('User_Profile')
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.profile_pic = profile_data.get('profile_pic', profile.profile_pic)
            profile.designation = profile_data.get('designation', profile.designation)
            profile.experience = profile_data.get('experience', profile.experience)
            profile.salary = profile_data.get('salary', profile.salary)
            profile.qualification = profile_data.get('qualification', profile.qualification)
            profile.save()
        return instance